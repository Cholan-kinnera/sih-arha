# LEWS — Phase 6A: Production Database Schema & Async Persistence Foundation

## 1. Executive Summary

Phase 6A establishes the **canonical production database architecture and async persistence foundation** for the Landslide Early Warning & Risk Monitoring System for the North-Eastern Region of India (LEWS — SIH26001).

The target architecture locks the production deployment stack:
$$\text{React/Vite SPA (Vercel)} \xrightarrow{\text{HTTPS/WSS}} \text{FastAPI ASGI (Render)} \xrightarrow{\text{AsyncEngine / asyncpg}} \text{PostgreSQL 15+ + PostGIS (Supabase)}$$

---

## 2. Implemented Subsystems & Artifacts

### 2.1 Domain Enums & Schema Types
- [`apps/api/app/db/enums.py`](file:///home/cholan0415/Projects/sih-arha/apps/api/app/db/enums.py): Centralized enums:
  - `Provenance`: `LIVE`, `HISTORICAL`, `CLIMATOLOGICAL`, `SIMULATED`, `EXPERIMENTAL`
  - `Severity`: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`
  - `AlertStatus`: `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`
  - `SourceStatus`: `CONNECTED`, `DEGRADED`, `STALE`, `OFFLINE`
  - `Freshness`: `FRESH`, `AGING`, `STALE`, `OFFLINE`
- [`apps/api/app/db/types.py`](file:///home/cholan0415/Projects/sih-arha/apps/api/app/db/types.py):
  - `PostGISGeometry`: Emits native `GEOMETRY` with SRID 4326 on PostgreSQL and `VARCHAR`/`TEXT` on SQLite for isolated tests.
  - `DialectJSONB`: Emits native `JSONB` on PostgreSQL and standard `JSON` on SQLite.

### 2.2 Canonical SQLAlchemy 2.x Async Models
All entity tables use standard UUID primary keys, and high-volume time-series/audit logs use `BIGSERIAL` (`BigInteger`):

| Table | Primary Key | Key Columns & Types | Foreign Keys & Cascades | Indexes & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `zones` | `UUID` (default `uuid4`) | `zone_id` (str, unique), `name`, `state`, `district`, `subdivision`, `is_ner`, `geometry` (`MULTIPOLYGON, 4326`) | — | `GIST(geometry)`, `ix_zones_zone_id`, `ix_zones_state`, `ix_zones_district`, `ix_zones_is_ner` |
| `zone_terrain_features` | `UUID` | `elevation_mean/min/max/std`, `slope_mean/min/max/std`, `aspect_mean`, `tri_mean`, `terrain_coverage` (bool), `source_provenance` | `zone_id` $\rightarrow$ `zones.id` (`CASCADE`) | `UNIQUE(zone_id)` |
| `data_sources` | `UUID` | `source_id` (str, unique), `name`, `provider`, `category`, `status`, `freshness`, `provenance`, `cadence`, `record_count`, `metadata` (`JSONB`) | — | `ix_data_sources_source_id` |
| `ingestion_events` | `BIGSERIAL` | `started_at`, `completed_at`, `status`, `records_ingested`, `duration_ms`, `message`, `provenance`, `metadata` (`JSONB`) | `source_id` $\rightarrow$ `data_sources.id` (`CASCADE`) | `(source_id, started_at DESC)`, `(status, started_at DESC)` |
| `sensors` | `UUID` | `sensor_id` (str, unique), `name`, `sensor_type`, `status`, `latitude`, `longitude`, `geometry` (`POINT, 4326`), `installed_at`, `metadata` (`JSONB`) | `zone_id` $\rightarrow$ `zones.id` (`SET NULL`), `source_id` $\rightarrow$ `data_sources.id` (`SET NULL`) | `GIST(geometry)`, `ix_sensors_sensor_id`, `ix_sensors_zone_id`, `ix_sensors_source_id` |
| `telemetry_readings` | `BIGSERIAL` | `timestamp`, `measurement_type`, `value`, `unit`, `provenance`, `metadata` (`JSONB`) | `sensor_id` $\rightarrow$ `sensors.id` (`SET NULL`), `zone_id` $\rightarrow$ `zones.id` (`CASCADE`) | `(zone_id, timestamp DESC)`, `(sensor_id, timestamp DESC)`, `(measurement_type, timestamp DESC)`, `(provenance)` |
| `risk_evaluations` | `BIGSERIAL` | `timestamp`, factors (`static_susceptibility`, `terrain_factor`, `rainfall_factor`, `soil_factor`, `historical_factor`), `dynamic_risk_score`, `severity`, `provenance`, `degraded_mode`, `degraded_reasons` (`JSONB`), `evidence` (`JSONB`) | `zone_id` $\rightarrow$ `zones.id` (`CASCADE`) | `CHECK(dynamic_risk_score >= 0.0 AND dynamic_risk_score <= 1.0)`, `(zone_id, timestamp DESC)`, `(severity, timestamp DESC)` |
| `alerts` | `UUID` | `alert_id` (str, unique), `severity`, `risk_score`, `trigger_reason`, `status`, `provenance`, `created_at`, `acknowledged_at`, `resolved_at` | `zone_id` $\rightarrow$ `zones.id` (`CASCADE`), `risk_evaluation_id` $\rightarrow$ `risk_evaluations.id` (`SET NULL`) | `(zone_id, created_at DESC)`, `(status, severity)`, `(created_at DESC)` |
| `alert_audit_history` | `BIGSERIAL` | `operator_id`, `action`, `notes`, `timestamp` | `alert_id` $\rightarrow$ `alerts.id` (`CASCADE`) | `(alert_id, timestamp DESC)` |

### 2.3 Async Connection Management & Alembic Migrations
- [`apps/api/app/db/session.py`](file:///home/cholan0415/Projects/sih-arha/apps/api/app/db/session.py): Provides `async_engine` (`create_async_engine`), `AsyncSessionLocal` (`async_sessionmaker`), `get_async_db` async generator dependency, and connection health verification.
- [`apps/api/alembic/versions/001_initial_schema.py`](file:///home/cholan0415/Projects/sih-arha/apps/api/alembic/versions/001_initial_schema.py): Canonical migration supporting PostGIS extension creation, GIST indexes, and verified downgrade/upgrade idempotence.

### 2.4 Production Async Database Seeder
- [`apps/api/app/seed.py`](file:///home/cholan0415/Projects/sih-arha/apps/api/app/seed.py):
  - Reads `data/processed/lews_baseline_dataset.parquet` and `data/processed/terrain_zone_features.parquet`.
  - Seeds 641 canonical districts (`ZONE-{STATE}-{DISTRICT}`) with exact NER partitioning.
  - Correctly maintains `terrain_coverage=False` and `NULL` for missing DEM metrics (zero fabrication).
  - Registers 5 data source catalog records with initial ingestion event logs.
  - Registers sensors, simulates 72-hour precipitation telemetry, and triggers initial dynamic risk evaluations.

### 2.5 Technical Schema Documentation
- [`docs/DATABASE_SCHEMA.md`](file:///home/cholan0415/Projects/sih-arha/docs/DATABASE_SCHEMA.md): Complete architectural documentation with Mermaid ER diagram, schema data dictionary, PostGIS spatial queries, missing-data scientific truthfulness guarantees, Supabase setup guide, and Render ASGI deployment notes.

---

## 3. Verification & Quality Gate Results

### 3.1 Backend & Database Test Suite
```bash
.venv/bin/pytest tests/
```
- **Total Tests**: 60 passed (0 failed, 2 warnings) in 16.92s
- **Coverage**:
  - `tests/test_async_database.py` (Async sessions, PostGIS types, foreign key cascades, check constraints, JSONB evidence)
  - `tests/api/` (API routes: Zones, Risk matrix, Telemetry ingestion, Alerts, Acknowledgment audit trail, Data sources, Health check)
  - `tests/test_risk_*.py`, `tests/test_ml_*.py`, `tests/test_pipeline.py`, `tests/test_terrain.py` (Scientific baseline integrity)

### 3.2 Alembic Migration Lifecycle Validation
```bash
alembic -c apps/api/alembic.ini upgrade head
alembic -c apps/api/alembic.ini downgrade -1
alembic -c apps/api/alembic.ini upgrade head
```
- **Result**: Migration upgraded to head, cleanly rolled back, and re-applied with zero errors.

### 3.3 Frontend Regression Gate
```bash
cd apps/web && npm run lint && npm test && npm run build
```
- **Linter (`oxlint`)**: 0 warnings, 0 errors (123 files checked in 72ms)
- **Unit Tests (`tsx --test`)**: 6 passed in 221ms
- **Production Bundle (`vite build`)**: Clean build in 970ms (`dist/index.html`, `dist/assets/index-*.css`, `dist/assets/index-*.js`)

### 3.4 Docker Compose & Git Hygiene
- `docker compose config`: Validated clean schema with PostGIS 16 container and async API service.
- `git diff --check`: 0 whitespace errors.
