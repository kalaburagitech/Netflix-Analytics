from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import SearchResponse

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
def search_titles(
    query: Optional[str] = Query(None, description="Search keyword in title, director, cast, or description"),
    type: Optional[str] = Query(None, description="Movie or TV Show"),
    country: Optional[str] = Query(None, description="Country filter"),
    genre: Optional[str] = Query(None, description="Genre category filter"),
    rating: Optional[str] = Query(None, description="Rating filter"),
    release_year_min: Optional[int] = Query(None, description="Minimum release year"),
    release_year_max: Optional[int] = Query(None, description="Maximum release year"),
    sort_by: str = Query("release_year", description="Field to sort by: release_year, title, type"),
    sort_order: str = Query("desc", description="asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Search and filter titles with pagination and metadata."""
    return analytics_service.search_titles(
        query=query,
        content_type=type,
        country=country,
        genre=genre,
        rating=rating,
        release_year_min=release_year_min,
        release_year_max=release_year_max,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size
    )
