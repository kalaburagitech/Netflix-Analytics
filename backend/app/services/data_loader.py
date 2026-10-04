from pathlib import Path
import pandas as pd
import logging
from backend.app.config import settings

logger = logging.getLogger(__name__)

class DataLoader:
    _instance = None
    _raw_df: pd.DataFrame = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DataLoader()
        return cls._instance

    def __init__(self):
        self._raw_df = None

    def load_data(self, file_path: Path = None, force_reload: bool = False) -> pd.DataFrame:
        if self._raw_df is not None and not force_reload:
            return self._raw_df

        target_path = file_path or settings.DATA_PATH
        
        # Fallback candidates if file not found at settings.DATA_PATH
        candidates = [
            target_path,
            Path("data/netflix_titles.csv"),
            Path("netflix_titles.csv"),
            Path("../data/netflix_titles.csv"),
            Path("../../data/netflix_titles.csv"),
            Path(__file__).resolve().parent.parent.parent.parent / "data" / "netflix_titles.csv"
        ]

        found_path = None
        for candidate in candidates:
            if candidate and candidate.exists():
                found_path = candidate
                break

        if not found_path:
            raise FileNotFoundError(
                f"Could not locate netflix_titles.csv in any standard path. Searched: {[str(c) for c in candidates]}"
            )

        logger.info(f"Loading Netflix dataset from {found_path}")
        df = pd.read_csv(found_path)
        self._raw_df = df
        self._csv_path = found_path
        return self._raw_df

    def add_title(self, record_data: dict) -> dict:
        """Append a new record to the CSV and update in-memory caches."""
        if self._raw_df is None:
            self.load_data()

        # Generate new show_id: s{max_number + 1}
        existing_ids = self._raw_df['show_id'].dropna().tolist()
        max_num = 0
        for sid in existing_ids:
            if str(sid).startswith('s'):
                try:
                    num = int(str(sid)[1:])
                    if num > max_num:
                        max_num = num
                except ValueError:
                    pass

        new_show_id = f"s{max_num + 1}"
        record_data['show_id'] = new_show_id

        # Default date_added to today if not provided
        from datetime import datetime
        if not record_data.get('date_added'):
            record_data['date_added'] = datetime.now().strftime("%B %d, %Y")

        new_row_df = pd.DataFrame([record_data])
        
        # Ensure column ordering matches original CSV
        cols = [
            'show_id', 'type', 'title', 'director', 'cast',
            'country', 'date_added', 'release_year', 'rating',
            'duration', 'listed_in', 'description'
        ]
        for c in cols:
            if c not in new_row_df.columns:
                new_row_df[c] = ""
        new_row_df = new_row_df[cols]

        # Update in-memory dataframe
        self._raw_df = pd.concat([self._raw_df, new_row_df], ignore_index=True)

        # Append to CSV file on disk
        target_path = getattr(self, '_csv_path', None) or settings.DATA_PATH
        if target_path and Path(target_path).exists():
            new_row_df.to_csv(target_path, mode='a', header=False, index=False)
            logger.info(f"Saved new title {new_show_id} to {target_path}")

        # Invalidate data_cleaner and data_quality caches so subsequent stats recalculate
        from backend.app.services.data_cleaner import data_cleaner
        data_cleaner.clean_data(force_refresh=True)
        try:
            from backend.app.services.data_quality_service import data_quality_service
            data_quality_service.invalidate_cache()
        except Exception:
            pass

        return record_data


    def get_schema_info(self) -> dict:
        """Returns standard metadata and headers for data modeling."""
        cols = [
            {"key": "show_id", "label": "Show ID", "required": False, "description": "Auto-generated identifier (e.g. s8808) if left blank"},
            {"key": "type", "label": "Type", "required": True, "description": "'Movie' or 'TV Show'"},
            {"key": "title", "label": "Title", "required": True, "description": "Unique title of the film or episodic show"},
            {"key": "director", "label": "Director", "required": False, "description": "Director name(s)"},
            {"key": "cast", "label": "Cast", "required": False, "description": "Key actors/performers, comma separated"},
            {"key": "country", "label": "Country", "required": False, "description": "Primary country of production (e.g. United States, India)"},
            {"key": "date_added", "label": "Date Added", "required": False, "description": "Ingestion date (e.g. September 25, 2021); auto-filled if blank"},
            {"key": "release_year", "label": "Release Year", "required": True, "description": "4-digit year of premiere (e.g. 2022)"},
            {"key": "rating", "label": "Rating", "required": False, "description": "Censorship classification (e.g. TV-MA, PG-13, R)"},
            {"key": "duration", "label": "Duration", "required": False, "description": "Runtime (e.g. '105 min' for movies, '2 Seasons' for TV)"},
            {"key": "listed_in", "label": "Genres", "required": False, "description": "Comma-separated genres (e.g. 'Action, Sci-Fi, Dramas')"},
            {"key": "description", "label": "Synopsis", "required": False, "description": "Brief narrative overview or plot summary"}
        ]
        return {
            "columns": cols,
            "column_keys": [c["key"] for c in cols],
            "required_keys": [c["key"] for c in cols if c["required"]],
            "sample_rows": self._get_sample_rows()
        }

    def _get_sample_rows(self) -> list:
        return [
            {
                "show_id": "",
                "type": "Movie",
                "title": "Inception Reimagined",
                "director": "Christopher Nolan",
                "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
                "country": "United States",
                "date_added": "September 25, 2021",
                "release_year": 2021,
                "rating": "PG-13",
                "duration": "148 min",
                "listed_in": "Action & Adventure, Sci-Fi",
                "description": "A skilled thief steals secrets through dream-sharing technology."
            },
            {
                "show_id": "",
                "type": "TV Show",
                "title": "Silicon Dynamics",
                "director": "KalaburagiTech Studio",
                "cast": "Dev Team, Analytics Crew",
                "country": "India",
                "date_added": "October 01, 2023",
                "release_year": 2023,
                "rating": "TV-MA",
                "duration": "2 Seasons",
                "listed_in": "TV Dramas, Sci-Fi & Fantasy",
                "description": "Engineers build an enterprise streaming intelligence and analytics platform."
            }
        ]

    def generate_template(self, file_format: str = "csv") -> tuple[bytes, str, str]:
        """Generate a downloadable pre-formatted template with standard headers."""
        import io
        cols = [
            'show_id', 'type', 'title', 'director', 'cast',
            'country', 'date_added', 'release_year', 'rating',
            'duration', 'listed_in', 'description'
        ]
        sample_df = pd.DataFrame(self._get_sample_rows())[cols]

        if file_format.lower() in ("xlsx", "excel"):
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine="openpyxl") as writer:
                sample_df.to_excel(writer, index=False, sheet_name="Netflix Titles Ingestion")
            output.seek(0)
            return (
                output.getvalue(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "kalaburagitech_netflix_ingestion_template.xlsx"
            )
        else:
            csv_str = sample_df.to_csv(index=False)
            return (
                csv_str.encode("utf-8"),
                "text/csv; charset=utf-8",
                "kalaburagitech_netflix_ingestion_template.csv"
            )

    def ingest_batch(self, file_bytes: bytes, filename: str) -> dict:
        """Parse, validate headings, clean, and append uploaded Excel/CSV records."""
        import io
        from datetime import datetime

        if self._raw_df is None:
            self.load_data()

        # Parse dataframe based on extension
        fn = filename.lower()
        try:
            if fn.endswith((".xlsx", ".xls")):
                df_upload = pd.read_excel(io.BytesIO(file_bytes), engine="openpyxl")
            else:
                try:
                    df_upload = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8")
                except UnicodeDecodeError:
                    df_upload = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1")
        except Exception as e:
            raise ValueError(f"Failed to read file: {str(e)}")

        if df_upload.empty:
            raise ValueError("The uploaded file contains no data rows.")

        # Header normalization and matching
        standard_cols = [
            'show_id', 'type', 'title', 'director', 'cast',
            'country', 'date_added', 'release_year', 'rating',
            'duration', 'listed_in', 'description'
        ]
        
        # Build mapping from normalized upload columns to standard columns
        upload_col_map = {str(c).strip().lower(): c for c in df_upload.columns}
        
        # Check required fields
        if 'title' not in upload_col_map:
            raise ValueError(
                f"Missing required heading: 'title'. Uploaded headings: {list(df_upload.columns)}"
            )

        matched_headers = []
        clean_rows = []

        # Find existing max show_id
        existing_ids = self._raw_df['show_id'].dropna().tolist()
        max_num = 0
        for sid in existing_ids:
            if str(sid).startswith('s'):
                try:
                    num = int(str(sid)[1:])
                    if num > max_num:
                        max_num = num
                except ValueError:
                    pass

        curr_year = datetime.now().year
        today_str = datetime.now().strftime("%B %d, %Y")

        for idx, row in df_upload.iterrows():
            # Title is required
            raw_title = row.get(upload_col_map.get('title', 'title'), '')
            if pd.isna(raw_title) or str(raw_title).strip() == '':
                continue  # Skip blank title rows

            record = {}
            for col in standard_cols:
                mapped_col = upload_col_map.get(col)
                if mapped_col is not None and mapped_col in row and not pd.isna(row[mapped_col]):
                    val = str(row[mapped_col]).strip()
                    if col == 'release_year':
                        try:
                            val = int(float(val))
                        except (ValueError, TypeError):
                            val = curr_year
                    record[col] = val
                    if col not in matched_headers:
                        matched_headers.append(col)
                else:
                    # Defaults
                    if col == 'show_id':
                        max_num += 1
                        record[col] = f"s{max_num}"
                    elif col == 'type':
                        record[col] = "Movie"
                    elif col == 'release_year':
                        record[col] = curr_year
                    elif col == 'date_added':
                        record[col] = today_str
                    elif col == 'country':
                        record[col] = "United States"
                    elif col == 'rating':
                        record[col] = "TV-MA"
                    elif col == 'duration':
                        record[col] = "90 min"
                    elif col == 'listed_in':
                        record[col] = "Dramas, International"
                    else:
                        record[col] = ""

            clean_rows.append(record)

        if not clean_rows:
            raise ValueError("No valid records with titles were found in the uploaded file.")

        new_batch_df = pd.DataFrame(clean_rows)[standard_cols]

        # Update in-memory dataframe
        self._raw_df = pd.concat([self._raw_df, new_batch_df], ignore_index=True)

        # Append to CSV file on disk
        target_path = getattr(self, '_csv_path', None) or settings.DATA_PATH
        if target_path and Path(target_path).exists():
            new_batch_df.to_csv(target_path, mode='a', header=False, index=False)
            logger.info(f"Appended {len(clean_rows)} records from batch upload to {target_path}")

        # Invalidate data_cleaner cache to recalculate all live metrics & analytics
        from backend.app.services.data_cleaner import data_cleaner
        data_cleaner.clean_data(force_refresh=True)

        return {
            "status": "success",
            "message": f"Successfully processed and ingested {len(clean_rows)} records into the KalaburagiTech Data Model!",
            "records_ingested": len(clean_rows),
            "total_records": len(self._raw_df),
            "matched_headers": matched_headers,
            "sample_titles": [r["title"] for r in clean_rows[:5]]
        }

    def delete_title(self, show_id: str) -> dict:
        """Delete a record by show_id from in-memory dataframe and CSV."""
        if self._raw_df is None:
            self.load_data()

        show_id_str = str(show_id).strip()
        matching_rows = self._raw_df[self._raw_df['show_id'].astype(str) == show_id_str]
        if matching_rows.empty:
            raise KeyError(f"Title with ID '{show_id}' was not found in dataset.")

        deleted_title = matching_rows.iloc[0]['title']

        # Remove matching row
        self._raw_df = self._raw_df[self._raw_df['show_id'].astype(str) != show_id_str].reset_index(drop=True)

        # Persist back to disk
        target_path = getattr(self, '_csv_path', None) or settings.DATA_PATH
        if target_path and Path(target_path).exists():
            self._raw_df.to_csv(target_path, index=False)
            logger.info(f"Deleted title '{deleted_title}' ({show_id_str}) and updated {target_path}")

        # Invalidate data cleaner
        from backend.app.services.data_cleaner import data_cleaner
        data_cleaner.clean_data(force_refresh=True)

        return {
            "status": "success",
            "message": f"Successfully deleted '{deleted_title}' ({show_id_str}) from the data model.",
            "show_id": show_id_str,
            "deleted_title": deleted_title,
            "total_records": len(self._raw_df)
        }

    def reset_dataset(self) -> dict:
        """Reset dataset to clean 8,807 baseline records."""
        baseline_candidates = [
            Path("data/netflix_titles_baseline.csv"),
            Path("../data/netflix_titles_baseline.csv"),
            Path("../../data/netflix_titles_baseline.csv"),
            Path(__file__).resolve().parent.parent.parent.parent / "data" / "netflix_titles_baseline.csv"
        ]
        baseline_path = None
        for cand in baseline_candidates:
            if cand and cand.exists():
                baseline_path = cand
                break

        if not baseline_path:
            raise FileNotFoundError("Baseline dataset 'netflix_titles_baseline.csv' not found.")

        # Load baseline
        baseline_df = pd.read_csv(baseline_path)
        self._raw_df = baseline_df.copy()

        # Overwrite CSV on disk
        target_path = getattr(self, '_csv_path', None) or settings.DATA_PATH
        if target_path and Path(target_path).exists():
            self._raw_df.to_csv(target_path, index=False)
            logger.info(f"Reset dataset to {len(self._raw_df)} baseline records in {target_path}")

        # Invalidate data cleaner
        from backend.app.services.data_cleaner import data_cleaner
        data_cleaner.clean_data(force_refresh=True)

        return {
            "status": "success",
            "message": f"Dataset successfully reset to official {len(self._raw_df):,} baseline records.",
            "total_records": len(self._raw_df)
        }

data_loader = DataLoader.get_instance()

