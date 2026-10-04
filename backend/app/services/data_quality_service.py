from typing import Dict, List, Any
import pandas as pd
import numpy as np
import logging
from backend.app.services.data_loader import data_loader
from backend.app.models.schemas import (
    DataQualityReport,
    ColumnCompleteness,
    HeatmapDecile,
    DuplicateTitleItem,
    DuplicateAnalysisReport,
    InvalidRecordItem,
    InvalidDataReport,
    RowCompletenessBucket
)

logger = logging.getLogger(__name__)

class DataQualityService:
    _instance = None
    _cached_report: DataQualityReport = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DataQualityService()
        return cls._instance

    def invalidate_cache(self):
        self._cached_report = None

    def get_quality_report(self, force_refresh: bool = False) -> DataQualityReport:
        if self._cached_report is not None and not force_refresh:
            return self._cached_report

        df = data_loader.load_data()
        total_records = len(df)
        columns = list(df.columns)
        total_fields = len(columns)
        total_cells = total_records * total_fields

        # 1. Column Completeness
        column_completeness: List[ColumnCompleteness] = []
        total_missing_cells = 0

        for col in columns:
            missing = int(df[col].isnull().sum())
            filled = total_records - missing
            total_missing_cells += missing
            pct = round((filled / total_records) * 100, 2) if total_records > 0 else 0.0

            if pct == 100.0:
                status = "excellent"
            elif pct >= 90.0:
                status = "good"
            elif pct >= 70.0:
                status = "warning"
            else:
                status = "critical"

            dtype_str = str(df[col].dtype)
            column_completeness.append(
                ColumnCompleteness(
                    column=col,
                    total_records=total_records,
                    filled_count=filled,
                    missing_count=missing,
                    completeness_percentage=pct,
                    status=status,
                    data_type=dtype_str
                )
            )

        total_filled_cells = total_cells - total_missing_cells
        overall_completeness_pct = (
            round((total_filled_cells / total_cells) * 100, 2) if total_cells > 0 else 100.0
        )

        if overall_completeness_pct >= 95.0:
            quality_score = "Grade A (Production Ready)"
        elif overall_completeness_pct >= 85.0:
            quality_score = "Grade B (Moderate Quality)"
        elif overall_completeness_pct >= 75.0:
            quality_score = "Grade C (Needs Cleansing)"
        else:
            quality_score = "Grade D (Critical Quality Issues)"

        # 2. Row Completeness Distribution
        missing_per_row = df.isnull().sum(axis=1)
        dist_counts = missing_per_row.value_counts().sort_index()
        row_distribution: List[RowCompletenessBucket] = []
        for missing_cnt, count in dist_counts.items():
            row_distribution.append(
                RowCompletenessBucket(
                    missing_fields_count=int(missing_cnt),
                    records_count=int(count),
                    percentage_of_catalog=round((int(count) / total_records) * 100, 2) if total_records > 0 else 0.0
                )
            )

        # 3. Missing Values Heatmap Matrix (12 batch slices across dataset)
        num_chunks = 12
        chunk_size = int(np.ceil(total_records / num_chunks)) if total_records > 0 else 1
        heatmap_matrix: List[HeatmapDecile] = []

        for i in range(num_chunks):
            start_idx = i * chunk_size
            end_idx = min((i + 1) * chunk_size, total_records)
            chunk = df.iloc[start_idx:end_idx]
            if len(chunk) == 0:
                continue

            bucket_label = f"Slice {i + 1}"
            record_range = f"#{start_idx + 1} - #{end_idx}"
            missing_by_col: Dict[str, float] = {}

            for col in columns:
                m_pct = round((float(chunk[col].isnull().sum()) / len(chunk)) * 100, 1)
                missing_by_col[col] = m_pct

            heatmap_matrix.append(
                HeatmapDecile(
                    bucket_label=bucket_label,
                    record_range=record_range,
                    missing_by_column=missing_by_col
                )
            )

        # 4. Duplicate Analysis
        exact_duplicates = int(df.duplicated().sum())
        norm_titles = df['title'].astype(str).str.strip().str.lower()
        dup_mask = norm_titles.duplicated(keep=False)
        dup_df = df[dup_mask].copy()

        duplicates_sample: List[DuplicateTitleItem] = []
        if len(dup_df) > 0:
            grouped = dup_df.groupby(norm_titles[dup_mask])
            for title_norm, group in grouped:
                title_display = str(group['title'].iloc[0])
                years = [int(y) for y in group['release_year'].tolist()]
                types = [str(t) for t in group['type'].tolist()]
                show_ids = [str(s) for s in group['show_id'].tolist()]
                countries = [str(c) if pd.notnull(c) else 'Unknown Country' for c in group['country'].tolist()]

                if len(set(years)) == 1 and len(set(types)) == 1:
                    reason = "Identical Release Duplication"
                elif len(set(types)) > 1:
                    reason = "Cross-Format Adaptation / Remake"
                else:
                    reason = "Multi-Year / Re-release Entry"

                duplicates_sample.append(
                    DuplicateTitleItem(
                        title=title_display,
                        count=len(group),
                        show_ids=show_ids,
                        types=types,
                        years=years,
                        countries=countries,
                        reason=reason
                    )
                )

        duplicate_report = DuplicateAnalysisReport(
            exact_duplicate_rows=exact_duplicates,
            duplicate_titles_count=len(duplicates_sample),
            total_affected_records=len(dup_df),
            duplicates_sample=duplicates_sample
        )

        # 5. Invalid Data Detection
        invalid_records: List[InvalidRecordItem] = []
        issues_by_type: Dict[str, int] = {
            "Field Column Shift": 0,
            "Missing Critical Metric": 0,
            "Missing Ingestion Date": 0,
            "Missing Content Rating": 0
        }

        # (a) Check shifted durations in rating column (classic Netflix dataset artifact)
        shifted_mask = df['rating'].astype(str).str.contains('min', na=False)
        shifted_df = df[shifted_mask]
        for _, row in shifted_df.iterrows():
            issues_by_type["Field Column Shift"] += 1
            invalid_records.append(
                InvalidRecordItem(
                    show_id=str(row['show_id']),
                    title=str(row['title']),
                    issue_type="Field Column Shift",
                    field="rating / duration",
                    raw_value=f'rating="{row["rating"]}", duration={row["duration"]}',
                    severity="high",
                    description=f'Runtime value "{row["rating"]}" was parsed into the "rating" column, causing "duration" to become null.'
                )
            )

        # (b) Check null durations not caught by shifted
        null_durs = df[df['duration'].isnull() & ~shifted_mask]
        for _, row in null_durs.iterrows():
            issues_by_type["Missing Critical Metric"] += 1
            invalid_records.append(
                InvalidRecordItem(
                    show_id=str(row['show_id']),
                    title=str(row['title']),
                    issue_type="Missing Critical Metric",
                    field="duration",
                    raw_value="null",
                    severity="high",
                    description="Runtime / duration is absent and cannot be calculated."
                )
            )

        # (c) Check null date_added
        null_dates = df[df['date_added'].isnull()]
        for _, row in null_dates.iterrows():
            issues_by_type["Missing Ingestion Date"] += 1
            invalid_records.append(
                InvalidRecordItem(
                    show_id=str(row['show_id']),
                    title=str(row['title']),
                    issue_type="Missing Ingestion Date",
                    field="date_added",
                    raw_value="null",
                    severity="medium",
                    description=f'Catalog addition date is missing for title released in {row["release_year"]}.'
                )
            )

        # (d) Check null ratings
        null_ratings = df[df['rating'].isnull()]
        for _, row in null_ratings.iterrows():
            issues_by_type["Missing Content Rating"] += 1
            invalid_records.append(
                InvalidRecordItem(
                    show_id=str(row['show_id']),
                    title=str(row['title']),
                    issue_type="Missing Content Rating",
                    field="rating",
                    raw_value="null",
                    severity="low",
                    description="Age censorship classification rating is unassigned."
                )
            )

        invalid_data_report = InvalidDataReport(
            total_invalid_issues=len(invalid_records),
            total_affected_records=len(set(r.show_id for r in invalid_records)),
            issues_by_type=issues_by_type,
            invalid_records=invalid_records
        )

        report = DataQualityReport(
            total_records=total_records,
            total_fields=total_fields,
            total_cells=total_cells,
            total_filled_cells=total_filled_cells,
            total_missing_cells=total_missing_cells,
            overall_completeness_percentage=overall_completeness_pct,
            quality_score=quality_score,
            column_completeness=column_completeness,
            row_completeness_distribution=row_distribution,
            heatmap_matrix=heatmap_matrix,
            heatmap_columns=columns,
            duplicate_analysis=duplicate_report,
            invalid_data=invalid_data_report
        )

        self._cached_report = report
        return report

data_quality_service = DataQualityService.get_instance()
