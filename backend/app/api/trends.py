from typing import List
from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import TrendItem

router = APIRouter(prefix="/trends", tags=["Trends"])

@router.get("", response_model=List[TrendItem])
def get_trends():
    """Retrieve historical releases and catalog addition trends."""
    return analytics_service.get_trends()
