from fastapi import APIRouter
from backend.app.services.insights_service import insights_service
from backend.app.models.schemas import InsightsResponse

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("", response_model=InsightsResponse)
def get_insights():
    """Retrieve strategic data-driven platform insights."""
    return insights_service.get_insights()
