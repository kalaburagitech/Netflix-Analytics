from typing import List
from fastapi import APIRouter, Query
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import CountryStatItem

router = APIRouter(prefix="/countries", tags=["Countries"])

@router.get("", response_model=List[CountryStatItem])
def get_countries(limit: int = Query(default=15, ge=1, le=100)):
    """Retrieve top content-producing countries."""
    return analytics_service.get_countries_stats(limit=limit)
