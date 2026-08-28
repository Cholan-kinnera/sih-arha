# Dockerfile for LEWS FastAPI Backend
FROM python:3.14-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH="/app"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications
COPY pyproject.toml /app/

# Install python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    "fastapi>=0.115.0" \
    "uvicorn[standard]>=0.30.0" \
    "pydantic>=2.7.0" \
    "pydantic-settings>=2.2.0" \
    "sqlalchemy>=2.0.0" \
    "alembic>=1.13.0" \
    "psycopg2-binary>=2.9.9" \
    "websockets>=12.0" \
    "pandas>=2.2.0" \
    "numpy>=1.26.0" \
    "scikit-learn>=1.4.0" \
    "joblib>=1.4.0" \
    "pyarrow>=15.0.0" \
    "rasterio>=1.3.0" \
    "shapely>=2.0.0" \
    "httpx>=0.27.0"

# Copy source code and data assets
COPY apps/ /app/apps/
COPY src/ /app/src/
COPY ml/ /app/ml/
COPY simulator/ /app/simulator/
COPY config/ /app/config/
COPY data/processed/ /app/data/processed/

# Expose FastAPI application port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start FastAPI server
CMD ["uvicorn", "apps.api.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
