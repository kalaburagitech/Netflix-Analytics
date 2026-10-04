from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import TVShowStatsResponse

router = APIRouter(prefix="/tvshows", tags=["TV Shows"])

@router.get("", response_model=TVShowStatsResponse)
def get_tv_shows_stats():
    """Retrieve TV Show metrics, season counts, and breakdowns."""
    return analytics_service.get_tv_shows_stats()
