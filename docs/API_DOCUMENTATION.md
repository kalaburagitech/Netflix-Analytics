# KalaburagiTech Netflix Analytics Platform — REST API Specification

The backend is built with **FastAPI** providing high-throughput, async REST endpoints serving structured statistical aggregations, catalog search with multi-faceted filtering, and streaming CSV data export.

**Base URL**: `http://127.0.0.1:8000/api`  
**Swagger UI Interactive Documentation**: `http://127.0.0.1:8000/docs`  
**ReDoc Specification**: `http://127.0.0.1:8000/redoc`

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service health status & metadata | None |
| `GET` | `/api/summary` | Top-level KPI counts & catalog boundaries | None |
| `GET` | `/api/movies` | Movie statistics, duration histogram & top directors | None |
| `GET` | `/api/tvshows` | TV Show metrics & season breakdown | None |
| `GET` | `/api/countries` | Top content-producing nations | `limit` (default: 15) |
| `GET` | `/api/genres` | Top catalog genres with movie/TV split | `limit` (default: 15) |
| `GET` | `/api/ratings` | Content maturity ratings & audience classifications | None |
| `GET` | `/api/trends` | Historical release output by year | None |
| `GET` | `/api/search` | Full-text search with faceted filters & pagination | `query`, `type`, `country`, `genre`, `rating`, `page`, `page_size`, `sort_by`, `sort_order` |
| `POST` | `/api/titles` | Add a new title (Movie / TV Show) and persist to dataset | Request body (`CreateTitleRequest`) |
| `GET` | `/api/export/csv` | Download matching filtered catalog as CSV | `query`, `type`, `country`, `genre`, `rating` |
| `GET` | `/api/insights` | Strategic automated data science insights | None |

---

## 2. Endpoint Details & Schemas

### `GET /api/summary`
Returns overarching catalog KPIs for high-level dashboard display.
```json
{
  "total_titles": 8807,
  "total_movies": 6131,
  "total_tv_shows": 2676,
  "movies_percentage": 69.62,
  "tv_shows_percentage": 30.38,
  "total_countries": 122,
  "total_directors": 4993,
  "total_genres": 42,
  "total_ratings": 18,
  "min_release_year": 1925,
  "max_release_year": 2021,
  "latest_addition": "Dick Johnson Is Dead"
}
```

### `GET /api/movies`
Returns movie-specific statistics, including average/median duration, duration distribution bins for histograms, and top directors.
```json
{
  "total_movies": 6131,
  "avg_duration_minutes": 99.6,
  "median_duration_minutes": 98.0,
  "min_duration_minutes": 3,
  "max_duration_minutes": 312,
  "duration_distribution": [
    { "bin_range": "3-23m", "min_val": 3, "max_val": 23, "count": 140 },
    ...
  ],
  "top_genres": [ ... ],
  "top_directors": [ ... ],
  "rating_breakdown": [ ... ]
}
```

### `GET /api/search`
Enables fast, multi-faceted filtering across the full dataset:
- `query`: Keyword matching against title, director, cast, or description.
- `type`: `Movie` or `TV Show`.
- `country`: Filters by country of origin.
- `genre`: Filters by genre category.
- `rating`: Filters by maturity rating (`TV-MA`, `TV-14`, `PG-13`, etc.).
- `page`: Page index (1-indexed).
- `page_size`: Number of records per page (default: 20).
- `sort_by`: Field name (`release_year`, `title`, `type`).
- `sort_order`: `desc` or `asc`.
