from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import MovieStatsResponse

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("", response_model=MovieStatsResponse)
def get_movies_stats():
    """Retrieve movie analytical distribution and metrics."""
    return analytics_service.get_movies_stats()
