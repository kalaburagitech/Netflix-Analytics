# 🎬 KalaburagiTech Netflix Analytics Platform

> **Advanced Netflix Data Analytics Dashboard built by KalaburagiTech**  
> A portfolio-grade, end-to-end data analytics platform transforming raw streaming data into interactive intelligence. Built with **FastAPI**, **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

---

## 1. Project Overview

The **KalaburagiTech Netflix Analytics Platform** is an enterprise data science and dashboard application designed to analyze, visualize, and query the global Netflix Movies & TV Shows dataset (8,807 titles).

Originally an exploratory data analysis (EDA) notebook, the project has been re-architected from the ground up by **KalaburagiTech** into a modular, decoupled web platform with:
- **FastAPI REST API**: High-throughput statistical microservices with full OpenAPI/Swagger documentation.
- **Modern Next.js Frontend**: Responsive, accessible web UI with Dark/Light theme switching, interactive charts, and glassmorphism styling.
- **Reproducible Python Pipeline**: Data loader, cleaning, and analysis modules executable via CLI or Jupyter.
- **Automated Test Suite**: 22 unit and API tests with 100% pass rate.
- **Zero External Dependencies**: Operates 100% locally without cloud requirements, paid APIs, or external databases.

---

## 2. Key Features

- **Executive KPI Dashboard**: Instant visibility into 8 primary metrics: Total Titles (8,807), Movies (6,131), TV Shows (2,676), Producing Countries (122), Directors (4,993), Genres (42), Ratings (18), and Timeline (1925–2021).
- **Deep Visual Analytics**:
  - *Movies vs. TV Shows Ratio*: Donut chart with category breakdown.
  - *Historical Release Trajectory*: Area gradient visualization of yearly production (2000–2021).
  - *Top Content Hubs*: Horizontal stacked bar chart of top producing nations.
  - *Genre Portfolio*: Multi-category classification breakdown.
  - *Movie Duration Histogram*: Runtime frequency analysis isolating the 90–110m sweet spot.
  - *Maturity Ratings*: Censorship classifications highlighting TV-MA and TV-14 demographics.
- **Catalog Data Explorer**:
  - Live full-text search across titles, directors, cast members, and synopses.
  - Multi-faceted filters for Content Type, Country, Genre, and Rating.
  - Column sorting (release year, title, type) and pagination.
  - Interactive title detail modal for deep synopsis inspection.
  - Direct CSV data export matching active filters.
- **Strategic Insights Engine**: Automated data science intelligence generating executive summaries, runtime optimization targets, demographic skew analysis, and market momentum bullets.
- **Dual Execution Pathways**: Run as an interactive web platform or execute as a headless Python CLI script.

---

## 3. Dataset Information

- **Source File**: `data/netflix_titles.csv`
- **Volume**: 8,807 rows × 12 columns
- **Attributes**: `show_id`, `type`, `title`, `director`, `cast`, `country`, `date_added`, `release_year`, `rating`, `duration`, `listed_in`, `description`
- **Data Integrity**: Cleaned via reproducible preprocessing pipeline in `backend/app/services/data_cleaner.py` without modifying raw source files.

---

## 4. Project Structure

```
netflix/
├── backend/
│   ├── app/
│   │   ├── api/                 # REST Route handlers (/api/*)
│   │   ├── models/              # Pydantic schemas
│   │   ├── services/            # DataLoader, DataCleaner, Analytics, Insights
│   │   ├── config.py            # Global settings & paths
│   │   └── main.py              # FastAPI application entrypoint
│   ├── requirements.txt         # Backend Python dependencies
│   └── run_backend.py           # Backend startup runner
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router (Landing, Dashboard, Analytics, Explorer, Insights)
│   │   ├── components/          # Reusable UI widgets & Recharts
│   │   └── lib/                 # Typed API client with fallback caching
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.ts       # Tailwind CSS configuration
│   └── tsconfig.json            # TypeScript configuration
├── data/
│   └── netflix_titles.csv       # Validated Netflix dataset
├── notebooks/
│   └── netflix_data_analysis.ipynb # Fully reproducible Jupyter EDA
├── outputs/                     # Generated PNG chart visualizations
├── tests/                       # Pytest automated test suite
├── docs/
│   ├── API_DOCUMENTATION.md     # Detailed API endpoints & schema specs
│   └── ARCHITECTURE.md          # System architecture breakdown
├── PROJECT_AUDIT.md             # In-depth repository audit & fixes
├── SETUP_STATUS.md              # Verification report & test logs
├── requirements.txt             # Root Python dependencies
├── run_analysis.py              # Standalone CLI analysis script
└── README.md                    # Platform documentation
```

---

## 5. System Requirements

- **Python**: 3.10 to 3.14 (tested and verified on Python 3.14.3)
- **Node.js**: 18.x or 20.x (tested and verified on Node v20.19.4)
- **Package Managers**: `pip` and `npm`
- **Operating System**: Windows, macOS, or Linux

---

## 6. Installation & Setup

### Step 1: Clone and Navigate to the Repository
```bash
git clone <repository-url>
cd netflix
```

### Step 2: Set Up Python Virtual Environment
```powershell
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 7. Running the Project

### Running the FastAPI Backend
Start the backend server on `http://127.0.0.1:8000`:
```powershell
# Windows PowerShell
.\.venv\Scripts\python.exe backend/run_backend.py

# Linux / macOS
python backend/run_backend.py
```
- **API Base URL**: `http://127.0.0.1:8000/api`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Specification**: `http://127.0.0.1:8000/redoc`

### Running the Next.js Frontend
In a separate terminal, start the web interface on `http://localhost:3000`:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Running Automated Tests

Run the full backend test suite covering data loading, transformations, calculations, and API endpoints:
```powershell
# Windows PowerShell
.\.venv\Scripts\pytest.exe -v

# Linux / macOS
pytest -v
```

**Expected Result:**
```
tests/test_analytics_service.py::test_summary_kpis PASSED
tests/test_analytics_service.py::test_movies_stats PASSED
tests/test_analytics_service.py::test_tv_shows_stats PASSED
tests/test_analytics_service.py::test_countries_stats PASSED
tests/test_analytics_service.py::test_trends PASSED
tests/test_analytics_service.py::test_search_and_pagination PASSED
tests/test_api.py::test_health_endpoint PASSED
tests/test_api.py::test_summary_endpoint PASSED
tests/test_api.py::test_movies_endpoint PASSED
tests/test_api.py::test_tvshows_endpoint PASSED
tests/test_api.py::test_countries_endpoint PASSED
tests/test_api.py::test_genres_endpoint PASSED
tests/test_api.py::test_ratings_endpoint PASSED
tests/test_api.py::test_trends_endpoint PASSED
tests/test_api.py::test_search_endpoint PASSED
tests/test_api.py::test_export_endpoint PASSED
tests/test_api.py::test_insights_endpoint PASSED
tests/test_data_cleaner.py::test_clean_data_handles_nulls PASSED
tests/test_data_cleaner.py::test_eda_clean_subset PASSED
tests/test_data_cleaner.py::test_duration_parsing PASSED
tests/test_data_loader.py::test_data_loader_returns_dataframe PASSED
tests/test_data_loader.py::test_required_columns_exist PASSED

======================== 22 passed in 2.63s ========================
```

---

## 9. Running the Standalone CLI Analysis Pipeline

To regenerate all static visualization PNGs and view analytical output without starting a server:
```powershell
.\.venv\Scripts\python.exe run_analysis.py
```

Generated charts will be saved to `outputs/`:
- `outputs/movies_vs_tv.png`
- `outputs/content_rating_pie.png`
- `outputs/movie_dur_hist.png`
- `outputs/top10_countries.png`
- `outputs/release_year_vs_show.png`
- `outputs/movies_tv_shows_comp.png`
- `outputs/genre_distribution.png`

---

## 10. Running the Jupyter Notebook

Launch JupyterLab or Jupyter Notebook:
```powershell
.\.venv\Scripts\jupyter.exe notebook notebooks/netflix_data_analysis.ipynb
```
Or execute the notebook in-place via CLI:
```powershell
.\.venv\Scripts\jupyter.exe nbconvert --to notebook --execute --inplace notebooks/netflix_data_analysis.ipynb
```

---

## 11. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `FileNotFoundError: netflix_titles.csv` | Script executed from non-root directory | `DataLoader` has automated fallback paths. Ensure `data/netflix_titles.csv` exists. |
| `ModuleNotFoundError: No module named 'backend'` | Python path does not include project root | Run scripts with `python backend/run_backend.py` or use `pytest.ini` which sets `pythonpath = .`. |
| Port 8000 or 3000 already in use | Conflicting process | Start with custom port: `uvicorn backend.app.main:app --port 8001` or `next dev -p 3001`. |
| UnicodeEncodeError on Windows | Windows console default cp1252 encoding | The scripts include `sys.stdout.reconfigure(encoding='utf-8')` to prevent encoding crashes. |

---

## 12. Known Limitations

- **Dataset Cutoff**: The source dataset covers catalog additions through late 2021; post-2021 titles require appending to `data/netflix_titles.csv`.
- **Static Duration Units**: TV shows are recorded by seasons while Movies are recorded in minutes. Both are separated into distinct analytical views.

---

## 13. License & Attribution

Developed and maintained as an independent analytics platform by **KalaburagiTech**.  
**Built with ❤️ by KalaburagiTech**
