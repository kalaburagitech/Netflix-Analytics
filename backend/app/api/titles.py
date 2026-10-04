from fastapi import APIRouter, HTTPException, status
from backend.app.models.schemas import CreateTitleRequest, TitleRecord
from backend.app.services.data_loader import data_loader

router = APIRouter(prefix="/titles", tags=["Titles"])

@router.post("", response_model=TitleRecord, status_code=status.HTTP_201_CREATED)
def create_title(payload: CreateTitleRequest):
    """
    Add a new movie or TV show to the Netflix dataset.
    Validates input and immediately persists to disk & in-memory analytics engine.
    """
    clean_type = payload.type.strip()
    if clean_type.lower() in ["movie", "movies"]:
        clean_type = "Movie"
    elif clean_type.lower() in ["tv show", "tv", "tv shows"]:
        clean_type = "TV Show"
    else:
        raise HTTPException(
            status_code=400,
            detail="Field 'type' must be either 'Movie' or 'TV Show'."
        )

    title_dict = {
        "type": clean_type,
        "title": payload.title.strip(),
        "director": payload.director.strip() if payload.director else "",
        "cast": payload.cast.strip() if payload.cast else "",
        "country": payload.country.strip() if payload.country else "",
        "release_year": int(payload.release_year),
        "rating": payload.rating.strip() if payload.rating else "TV-MA",
        "duration": payload.duration.strip() if payload.duration else ("90 min" if clean_type == "Movie" else "1 Season"),
        "listed_in": payload.listed_in.strip() if payload.listed_in else "General",
        "description": payload.description.strip() if payload.description else "",
    }

    created = data_loader.add_title(title_dict)
    return TitleRecord(**created)

@router.delete("/{show_id}")
def delete_title(show_id: str):
    """
    Delete a movie or TV show by its show_id.
    Immediately updates data model, CSV dataset on disk, and recalculates analytics.
    """
    try:
        return data_loader.delete_title(show_id)
    except KeyError as ke:
        raise HTTPException(status_code=404, detail=str(ke))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete record: {str(e)}")

