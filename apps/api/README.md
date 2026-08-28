# LEWS Backend API (`apps/api`)

Production-grade FastAPI backend for the **Landslide Early Warning & Risk Monitoring System for the North-Eastern Region of India (SIH26001)**.

---

## 1. Architecture Overview

```
apps/api/
    app/
        main.py                     # FastAPI Application factory & Lifespan
        config.py                   # Pydantic Settings
        seed.py                     # Controlled DB seed from processed datasets

        api/
            routes/
                health.py           # GET /health, GET /api/v1/health
                zones.py            # GET /api/v1/zones, GET /api/v1/zones/{id}
                risk.py             # GET /api/v1/risk/current, GET /api/v1/risk/{id}
                telemetry.py        # POST /api/v1/telemetry, WS /api/v1/ws/telemetry
                alerts.py           # GET/POST /api/v1/alerts
                data_sources.py     # GET /api/v1/sources

        schemas/                    # Pydantic API Contracts
        services/                   # Service layer orchestrating domain modules
        db/                         # SQLAlchemy Base, Session & Models
    alembic/                        # Database Migration scripts
    Dockerfile                      # Container definition
    alembic.ini                     # Alembic configuration
```

---

## 2. Database Setup & Migrations

### Canonical Database: PostgreSQL / PostGIS
The production stack uses PostgreSQL with PostGIS extension.

```bash
# 1. Run migrations
alembic -c apps/api/alembic.ini upgrade head

# 2. Seed baseline database
.venv/bin/python -m apps.api.app.seed
```

### Rollback:
```bash
alembic -c apps/api/alembic.ini downgrade -1
```

---

## 3. Running Locally

```bash
# Start API locally with uvicorn
uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 4. Docker Deployment

```bash
# Start PostgreSQL/PostGIS and FastAPI services
docker compose up --build
```

---

## 5. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Live service & database connectivity health check |
| `GET` | `/api/v1/zones` | Filtered & paginated monitored catchment zones |
| `GET` | `/api/v1/zones/{zone_id}` | Detailed zone profile with terrain & risk context |
| `GET` | `/api/v1/risk/current` | Dynamic risk matrix snapshot across all zones |
| `GET` | `/api/v1/risk/{zone_id}` | Real-time multi-factor dynamic risk evaluation |
| `POST`| `/api/v1/telemetry` | Ingest time-series observation & trigger risk pipeline |
| `WS`  | `/api/v1/ws/telemetry` | Real-time WebSocket stream for telemetry & alert feeds |
| `GET` | `/api/v1/alerts` | Filtered operational alerts |
| `POST`| `/api/v1/alerts/{id}/acknowledge` | Acknowledge alert & append immutable audit entry |
| `GET` | `/api/v1/alerts/{id}/audit` | View chronological audit trail |
| `GET` | `/api/v1/sources` | Data source catalog & ingestion observability |
