from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SummaryKPIs(BaseModel):
    total_titles: int
    total_movies: int
    total_tv_shows: int
    movies_percentage: float
    tv_shows_percentage: float
    total_countries: int
    total_directors: int
    total_genres: int
    total_ratings: int
    min_release_year: int
    max_release_year: int
    latest_addition: Optional[str] = None

class MovieDurationBin(BaseModel):
    bin_range: str
    min_val: int
    max_val: int
    count: int

class MovieStatsResponse(BaseModel):
    total_movies: int
    avg_duration_minutes: float
    median_duration_minutes: float
    min_duration_minutes: int
    max_duration_minutes: int
    duration_distribution: List[MovieDurationBin]
    top_genres: List[Dict[str, Any]]
    top_directors: List[Dict[str, Any]]
    rating_breakdown: List[Dict[str, Any]]

class TVShowStatsResponse(BaseModel):
    total_tv_shows: int
    season_distribution: List[Dict[str, Any]]
    top_genres: List[Dict[str, Any]]
    top_countries: List[Dict[str, Any]]
    rating_breakdown: List[Dict[str, Any]]

class CountryStatItem(BaseModel):
    country: str
    total_shows: int
    movies_count: int
    tv_shows_count: int
    percentage_of_total: float

class GenreStatItem(BaseModel):
    genre: str
    total_count: int
    movies_count: int
    tv_shows_count: int

class RatingStatItem(BaseModel):
    rating: str
    count: int
    percentage: float
    target_audience: str

class TrendItem(BaseModel):
    year: int
    total_shows: int
    movies: int
    tv_shows: int

class TitleRecord(BaseModel):
    show_id: str
    type: str
    title: str
    director: Optional[str] = ""
    cast: Optional[str] = ""
    country: Optional[str] = ""
    date_added: Optional[str] = ""
    release_year: int
    rating: Optional[str] = ""
    duration: Optional[str] = ""
    listed_in: Optional[str] = ""
    description: Optional[str] = ""

class CreateTitleRequest(BaseModel):
    type: str = Field(..., description="Movie or TV Show")
    title: str = Field(..., min_length=1, description="Title of the film or TV show")
    director: Optional[str] = Field(default="", description="Director name(s)")
    cast: Optional[str] = Field(default="", description="Cast members")
    country: Optional[str] = Field(default="", description="Production country")
    release_year: int = Field(default=2026, ge=1900, le=2030, description="Year of original release")
    rating: Optional[str] = Field(default="TV-MA", description="Maturity rating: TV-MA, TV-14, PG-13, R, etc.")
    duration: Optional[str] = Field(default="95 min", description="Duration (e.g. '95 min' for movie or '1 Season' for TV show)")
    listed_in: Optional[str] = Field(default="Dramas, International Movies", description="Comma-separated genres")
    description: Optional[str] = Field(default="", description="Brief synopsis")


class SearchResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: List[TitleRecord]
    available_filters: Dict[str, List[Any]]

class InsightItem(BaseModel):
    category: str
    title: str
    description: str
    key_metric: str
    impact: str
    recommendation: Optional[str] = None

class InsightsResponse(BaseModel):
    summary: str
    insights: List[InsightItem]
    country_insights: List[str]
    genre_insights: List[str]
    rating_insights: List[str]
    trend_insights: List[str]


# --- Data Quality Dashboard Schemas ---

class ColumnCompleteness(BaseModel):
    column: str
    total_records: int
    filled_count: int
    missing_count: int
    completeness_percentage: float
    status: str  # 'excellent' | 'good' | 'warning' | 'critical'
    data_type: str

class HeatmapDecile(BaseModel):
    bucket_label: str
    record_range: str
    missing_by_column: Dict[str, float]

class DuplicateTitleItem(BaseModel):
    title: str
    count: int
    show_ids: List[str]
    types: List[str]
    years: List[int]
    countries: List[str]
    reason: str

class DuplicateAnalysisReport(BaseModel):
    exact_duplicate_rows: int
    duplicate_titles_count: int
    total_affected_records: int
    duplicates_sample: List[DuplicateTitleItem]

class InvalidRecordItem(BaseModel):
    show_id: str
    title: str
    issue_type: str
    field: str
    raw_value: Optional[str] = None
    severity: str  # 'high' | 'medium' | 'low'
    description: str

class InvalidDataReport(BaseModel):
    total_invalid_issues: int
    total_affected_records: int
    issues_by_type: Dict[str, int]
    invalid_records: List[InvalidRecordItem]

class RowCompletenessBucket(BaseModel):
    missing_fields_count: int
    records_count: int
    percentage_of_catalog: float

class DataQualityReport(BaseModel):
    total_records: int
    total_fields: int
    total_cells: int
    total_filled_cells: int
    total_missing_cells: int
    overall_completeness_percentage: float
    quality_score: str
    column_completeness: List[ColumnCompleteness]
    row_completeness_distribution: List[RowCompletenessBucket]
    heatmap_matrix: List[HeatmapDecile]
    heatmap_columns: List[str]
    duplicate_analysis: DuplicateAnalysisReport
    invalid_data: InvalidDataReport

