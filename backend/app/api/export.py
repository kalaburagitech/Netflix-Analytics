from typing import Optional
import io
from fastapi import APIRouter, Query, Response
import pandas as pd
from backend.app.services.analytics_service import analytics_service

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/csv")
def export_csv(
    query: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    rating: Optional[str] = Query(None)
):
    """Export dataset matching current filters as a CSV file."""
    search_res = analytics_service.search_titles(
        query=query,
        content_type=type,
        country=country,
        genre=genre,
        rating=rating,
        page=1,
        page_size=10000
    )

    records = [item.model_dump() for item in search_res.items]
    export_df = pd.DataFrame(records)
    
    stream = io.StringIO()
    export_df.to_csv(stream, index=False)
    
    response = Response(
        content=stream.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=kalaburagitech_netflix_export.csv"
        }
    )
    return response
