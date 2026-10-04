from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service
from backend.app.models.schemas import SummaryKPIs

router = APIRouter(prefix="/summary", tags=["Summary"])

@router.get("", response_model=SummaryKPIs)
def get_summary():
    """Retrieve top-level platform KPIs."""
    return analytics_service.get_summary()
