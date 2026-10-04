from typing import List
from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import RatingStatItem

router = APIRouter(prefix="/ratings", tags=["Ratings"])

@router.get("", response_model=List[RatingStatItem])
def get_ratings():
    """Retrieve content maturity ratings and target audience groups."""
    return analytics_service.get_ratings_stats()
