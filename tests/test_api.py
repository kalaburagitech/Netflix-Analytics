import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["company"] == "KalaburagiTech"

def test_summary_endpoint():
    response = client.get("/api/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_titles"] >= 8807
    assert data["total_movies"] >= 6131

def test_movies_endpoint():
    response = client.get("/api/movies")
    assert response.status_code == 200
    data = response.json()
    assert "duration_distribution" in data
    assert data["total_movies"] >= 6131

def test_tvshows_endpoint():
    response = client.get("/api/tvshows")
    assert response.status_code == 200
    data = response.json()
    assert "season_distribution" in data
    assert data["total_tv_shows"] == 2676

def test_countries_endpoint():
    response = client.get("/api/countries?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["country"] == "United States"

def test_genres_endpoint():
    response = client.get("/api/genres?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

def test_ratings_endpoint():
    response = client.get("/api/ratings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_trends_endpoint():
    response = client.get("/api/trends")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_search_endpoint():
    response = client.get("/api/search?query=india&type=Movie&page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) <= 5

def test_export_endpoint():
    response = client.get("/api/export/csv?type=Movie")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "kalaburagitech_netflix_export.csv" in response.headers.get("content-disposition", "")

def test_insights_endpoint():
    response = client.get("/api/insights")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "insights" in data
    assert len(data["insights"]) > 0

def test_create_title_endpoint():
    payload = {
        "type": "Movie",
        "title": "KalaburagiTech: The Innovation Story",
        "director": "KalaburagiTech Media",
        "cast": "Tech Visionaries, Engineers",
        "country": "India",
        "release_year": 2026,
        "rating": "TV-PG",
        "duration": "105 min",
        "listed_in": "Documentaries, International Movies",
        "description": "An inspiring inside look at how modern data platforms are engineered."
    }
    response = client.post("/api/titles", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "KalaburagiTech: The Innovation Story"
    assert data["type"] == "Movie"
    assert data["show_id"].startswith("s")

def test_ingestion_schema_endpoint():
    response = client.get("/api/ingestion/schema")
    assert response.status_code == 200
    data = response.json()
    assert "columns" in data
    assert "column_keys" in data
    assert "title" in data["column_keys"]
    assert "type" in data["column_keys"]

def test_download_template_csv():
    response = client.get("/api/ingestion/template?format=csv")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "kalaburagitech_netflix_ingestion_template.csv" in response.headers.get("content-disposition", "")
    assert b"show_id,type,title" in response.content

def test_download_template_excel():
    response = client.get("/api/ingestion/template?format=excel")
    assert response.status_code == 200
    assert "spreadsheet" in response.headers["content-type"]
    assert "kalaburagitech_netflix_ingestion_template.xlsx" in response.headers.get("content-disposition", "")

def test_upload_dataset_csv():
    csv_content = b"title,type,release_year,country,rating,duration,listed_in,description\nBatch Movie 1,Movie,2024,India,PG-13,110 min,Sci-Fi,Story 1\nBatch TV 2,TV Show,2025,United States,TV-MA,1 Season,Drama,Story 2\n"
    response = client.post(
        "/api/ingestion/upload",
        files={"file": ("test_batch.csv", csv_content, "text/csv")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["records_ingested"] == 2
    assert "title" in data["matched_headers"]

def test_delete_title_endpoint():
    # First create a test title to delete
    create_res = client.post("/api/titles", json={
        "type": "Movie",
        "title": "Title To Delete Test",
        "release_year": 2024
    })
    assert create_res.status_code == 201
    show_id = create_res.json()["show_id"]

    # Delete it
    del_res = client.delete(f"/api/titles/{show_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"
    assert del_res.json()["show_id"] == show_id

    # Verify 404 on deleting non-existent
    del_res_404 = client.delete(f"/api/titles/{show_id}")
    assert del_res_404.status_code == 404

def test_reset_dataset_endpoint():
    res = client.post("/api/ingestion/reset")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["total_records"] == 8807



