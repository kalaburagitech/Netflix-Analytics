from typing import List
from fastapi import APIRouter, Query
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import GenreStatItem

router = APIRouter(prefix="/genres", tags=["Genres"])

@router.get("", response_model=List[GenreStatItem])
def get_genres(limit: int = Query(default=15, ge=1, le=100)):
    """Retrieve top genres across catalog with movie vs TV breakdown."""
    return analytics_service.get_genres_stats(limit=limit)
