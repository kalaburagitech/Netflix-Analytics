FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy files
COPY . .

# Ensure data is accessible in standard locations
RUN if [ -d "backend/data" ] && [ ! -d "data" ]; then \
      cp -r backend/data data 2>/dev/null || true; \
    elif [ -d "data" ] && [ ! -d "backend/data" ]; then \
      mkdir -p backend && cp -r data backend/data 2>/dev/null || true; \
    fi

ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE 8000

# Start FastAPI on Render's dynamic $PORT
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
