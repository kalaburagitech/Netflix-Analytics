import os
from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "KalaburagiTech Netflix Analytics Platform"
    APP_NAME: str = "KalaburagiTech Netflix Analytics"
    DESCRIPTION: str = "Advanced Netflix Data Analytics Dashboard built by KalaburagiTech"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Path settings
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATA_PATH: Path = BASE_DIR / "data" / "netflix_titles.csv"
    OUTPUTS_DIR: Path = BASE_DIR / "outputs"
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()
