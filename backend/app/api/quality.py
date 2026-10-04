from fastapi import APIRouter
from backend.app.services.data_quality_service import data_quality_service
from backend.app.models.schemas import DataQualityReport

router = APIRouter(prefix="/quality", tags=["Data Quality & Integrity"])

@router.get("", response_model=DataQualityReport)
def get_data_quality_report():
    """
    Retrieve comprehensive data quality analytics:
    - Missing Values Heatmap matrix
    - Column and dataset Completeness %
    - Duplicate Title & Row Analysis
    - Invalid Data Anomaly Detection
    """
    return data_quality_service.get_quality_report()
