from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import Response
from backend.app.services.data_loader import data_loader

router = APIRouter(prefix="/ingestion", tags=["Data Ingestion & Modeling"])

@router.get("/schema")
def get_schema():
    """Retrieve the standard schema headers, data types, and sample template records."""
    return data_loader.get_schema_info()

@router.get("/template")
def download_template(format: str = Query("csv", description="Template format: 'csv' or 'excel'")):
    """Download the official pre-formatted ingestion template with standard headers."""
    content_bytes, media_type, filename = data_loader.generate_template(format)
    return Response(
        content=content_bytes,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload and ingest an Excel (.xlsx, .xls) or CSV (.csv) file into the data model."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was uploaded.")

    fn = file.filename.lower()
    if not (fn.endswith(".csv") or fn.endswith(".xlsx") or fn.endswith(".xls")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a .csv or .xlsx Excel file."
        )

    try:
        content = await file.read()
        result = data_loader.ingest_batch(content, file.filename)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal ingestion error: {str(e)}")

@router.post("/reset")
def reset_dataset():
    """
    Reset dataset to clean official 8,807 baseline records.
    Removes all test uploads/additions and restores initial dataset.
    """
    try:
        return data_loader.reset_dataset()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset dataset: {str(e)}")

