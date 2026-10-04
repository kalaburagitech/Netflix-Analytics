from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api.summary import router as summary_router
from backend.app.api.movies import router as movies_router
from backend.app.api.tvshows import router as tvshows_router
from backend.app.api.countries import router as countries_router
from backend.app.api.genres import router as genres_router
from backend.app.api.ratings import router as ratings_router
from backend.app.api.trends import router as trends_router
from backend.app.api.search import router as search_router
from backend.app.api.export import router as export_router
from backend.app.api.insights import router as insights_router
from backend.app.api.titles import router as titles_router
from backend.app.api.ingestion import router as ingestion_router
from backend.app.api.quality import router as quality_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health & Welcome endpoints
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to KalaburagiTech Netflix Analytics Platform API",
        "documentation": "/docs",
        "health": "/api/health",
        "frontend": "http://localhost:3000 (or 3001)"
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "company": "KalaburagiTech",
        "version": settings.VERSION
    }

# Include API Routers
app.include_router(summary_router, prefix=settings.API_PREFIX)
app.include_router(movies_router, prefix=settings.API_PREFIX)
app.include_router(tvshows_router, prefix=settings.API_PREFIX)
app.include_router(countries_router, prefix=settings.API_PREFIX)
app.include_router(genres_router, prefix=settings.API_PREFIX)
app.include_router(ratings_router, prefix=settings.API_PREFIX)
app.include_router(trends_router, prefix=settings.API_PREFIX)
app.include_router(search_router, prefix=settings.API_PREFIX)
app.include_router(export_router, prefix=settings.API_PREFIX)
app.include_router(insights_router, prefix=settings.API_PREFIX)
app.include_router(titles_router, prefix=settings.API_PREFIX)
app.include_router(ingestion_router, prefix=settings.API_PREFIX)
app.include_router(quality_router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
