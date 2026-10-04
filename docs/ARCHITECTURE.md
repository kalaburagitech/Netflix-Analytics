# KalaburagiTech Netflix Analytics Platform — System Architecture

## Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                        KalaburagiTech Analytics Client                            |
|        (Next.js 14, TypeScript, Tailwind CSS, Recharts, Framer Motion)           |
+-----------------------------------------------------------------------------------+
       | (HTTP / REST)                                        | (Static fallback)
       v                                                      v
+--------------------------------------------------+   +-----------------------------+
|               FastAPI Application                |   | Cached Statistical Profiles |
| (Async Endpoints, Pydantic Models, CORS Filter)  |   | (Zero-Downtime Reliability) |
+--------------------------------------------------+   +-----------------------------+
       |
       v
+--------------------------------------------------+
|           KalaburagiTech Core Services           |
|  - DataLoader (Resilient CSV Ingestion)          |
|  - DataCleaner (Standardized Transformations)    |
|  - AnalyticsService (Aggregations & Bins)        |
|  - InsightsService (Automated Executive Intel)   |
+--------------------------------------------------+
       |
       v
+--------------------------------------------------+
|                 Data Storage                     |
|           data/netflix_titles.csv                |
|           (8,807 Rows, 12 Standard Columns)      |
+--------------------------------------------------+
```

## Architectural Highlights

1. **Decoupled Backend & Frontend**:
   - The FastAPI backend handles high-speed pandas computation, data-cleaning pipelines, search querying, and CSV stream generation.
   - The Next.js frontend delivers responsive, accessible, animated interfaces with Dark/Light themes, Recharts visualizations, and interactive filtering.

2. **Zero External Dependency Risk**:
   - Runs 100% locally on standard Python and Node.js without requiring third-party cloud services, paid APIs, or database servers.

3. **Data Integrity & Backward Compatibility**:
   - Original EDA results, calculations, and visual styles from the source notebook are preserved, enhanced, and verified across both Jupyter and web interfaces.
