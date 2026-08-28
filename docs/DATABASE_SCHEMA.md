# LEWS — Production Database Architecture & Schema Specification

**System**: Landslide Early Warning & Risk Monitoring System for the North-Eastern Region of India (LEWS)
**Database Engine**: PostgreSQL 15+ with PostGIS 3.3+ Extension
**ORM & Driver**: SQLAlchemy 2.x Async + `asyncpg`
**Target Persistence**: Supabase PostgreSQL (Managed High-Availability Cloud)
**Target Application Host**: Render (ASGI Async Worker)
**Target Frontend Host**: Vercel (React 19 / Vite SPA)

---

## 1. System Architecture & Persistence Topology

```
┌──────────────────────────────────────────────────────────┐
│                   React 19 / Vite SPA                    │
│             Deployed on Vercel Edge Network              │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS / WSS
┌────────────────────────────▼─────────────────────────────┐
│                    FastAPI Backend                       │
│           Asynchronous ASGI Application on Render        │
│         (Uvicorn + AsyncEngine + async_sessionmaker)     │
└────────────────────────────┬─────────────────────────────┘
                             │ Asyncpg Connection Pool (SSL)
┌────────────────────────────▼─────────────────────────────┐
│             Supabase PostgreSQL 15+ + PostGIS            │
│  - Geospatial Catchment Polygons & Sensor Points (GIST)  │
│  - High-Volume Telemetry & Risk Time-Series              │
│  - Immutable Operational Alert Audit Logs                │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    zones ||--o| zone_terrain_features : "has terrain intelligence"
    zones ||--o{ sensors : "contains sensors"
    zones ||--o{ telemetry_readings : "receives readings"
    zones ||--o{ risk_evaluations : "evaluated for risk"
    zones ||--o{ alerts : "triggers alerts"

    data_sources ||--o{ ingestion_events : "tracks ingestion history"
    data_sources ||--o{ sensors : "provides sensor stream"

    sensors ||--o{ telemetry_readings : "records"

    risk_evaluations ||--o{ alerts : "justifies alert"

    alerts ||--o{ alert_audit_history : "records operator audit trail"

    zones {
        UUID id PK
        VARCHAR zone_id UK "ZONE-{STATE}-{DISTRICT}"
        VARCHAR name
        VARCHAR state
        VARCHAR district
        VARCHAR subdivision
        BOOLEAN is_ner
        GEOMETRY geometry "MULTIPOLYGON, 4326 (GIST)"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    zone_terrain_features {
        UUID id PK
        UUID zone_id FK,UK "1-to-1 with zones"
        FLOAT elevation_mean "meters (NULL if no DEM)"
        FLOAT elevation_min "meters"
        FLOAT elevation_max "meters"
        FLOAT elevation_std "meters"
        FLOAT slope_mean "degrees (NULL if no DEM)"
        FLOAT slope_min "degrees"
        FLOAT slope_max "degrees"
        FLOAT slope_std "degrees"
        FLOAT aspect_mean "degrees"
        FLOAT tri_mean "Terrain Roughness Index"
        BOOLEAN terrain_coverage "Explicit boolean flag"
        VARCHAR source_provenance "'TERRAIN_AVAILABLE' or 'TERRAIN_UNAVAILABLE'"
        TIMESTAMPTZ updated_at
    }

    data_sources {
        UUID id PK
        VARCHAR source_id UK "SRC-{PROVIDER}-{NAME}"
        VARCHAR name
        VARCHAR provider "IMD, GSI, NASA, ISRO"
        VARCHAR category "CLIMATOLOGY, GEOLOGICAL, PRECIPITATION, TERRAIN"
        VARCHAR status "CONNECTED, DEGRADED, STALE, OFFLINE"
        VARCHAR freshness "FRESH, AGING, STALE, OFFLINE"
        VARCHAR provenance "LIVE, HISTORICAL, CLIMATOLOGICAL, SIMULATED"
        VARCHAR cadence
        TIMESTAMPTZ last_ingested_at
        INTEGER record_count
        JSONB metadata
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    ingestion_events {
        BIGSERIAL id PK
        UUID source_id FK
        TIMESTAMPTZ started_at
        TIMESTAMPTZ completed_at
        VARCHAR status "SUCCESS, FAILED, RUNNING"
        INTEGER records_ingested
        INTEGER duration_ms
        TEXT message
        VARCHAR provenance
        JSONB metadata
    }

    sensors {
        UUID id PK
        VARCHAR sensor_id UK "SENS-{ZONE_ID}-{TYPE}"
        UUID zone_id FK
        UUID source_id FK
        VARCHAR name
        VARCHAR sensor_type "RAINGAUGE_TELEMETERED, SOIL_MOISTURE_PROBE, etc."
        VARCHAR status "CONNECTED, DEGRADED, STALE, OFFLINE"
        FLOAT latitude
        FLOAT longitude
        GEOMETRY geometry "POINT, 4326 (GIST)"
        TIMESTAMPTZ installed_at
        JSONB metadata
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    telemetry_readings {
        BIGSERIAL id PK
        UUID sensor_id FK
        UUID zone_id FK
        TIMESTAMPTZ timestamp "Measurement timestamp"
        VARCHAR measurement_type "rainfall_rate_mm_h, soil_moisture_pct, etc."
        FLOAT value
        VARCHAR unit "mm/h, %, etc."
        VARCHAR provenance "LIVE, HISTORICAL, SIMULATED"
        JSONB metadata
        TIMESTAMPTZ created_at
    }

    risk_evaluations {
        BIGSERIAL id PK
        UUID zone_id FK
        TIMESTAMPTZ timestamp
        FLOAT static_susceptibility "[0, 1]"
        FLOAT terrain_factor "[0, 1] (NULL if degraded)"
        FLOAT rainfall_factor "[0, 1]"
        FLOAT soil_factor "[0, 1] (NULL if unavailable)"
        FLOAT historical_factor "[0, 1]"
        FLOAT dynamic_risk_score "[0, 1] CHECK constraint"
        VARCHAR severity "LOW, MODERATE, HIGH, CRITICAL"
        VARCHAR provenance "LIVE, HISTORICAL, SIMULATED"
        BOOLEAN degraded_mode "True when missing terrain/soil"
        JSONB degraded_reasons "Array of missing modalities"
        VARCHAR model_version
        JSONB evidence "Complete RiskEvidenceBundle payload"
        TIMESTAMPTZ created_at
    }

    alerts {
        UUID id PK
        VARCHAR alert_id UK "ALT-{YEAR}-{HEX}"
        UUID zone_id FK
        BIGINT risk_evaluation_id FK
        VARCHAR severity "LOW, MODERATE, HIGH, CRITICAL"
        FLOAT risk_score "[0, 1]"
        TEXT trigger_reason
        VARCHAR status "ACTIVE, ACKNOWLEDGED, RESOLVED"
        VARCHAR provenance
        TIMESTAMPTZ created_at
        TIMESTAMPTZ acknowledged_at
        TIMESTAMPTZ resolved_at
    }

    alert_audit_history {
        BIGSERIAL id PK
        UUID alert_id FK
        VARCHAR operator_id
        VARCHAR action "ALERT_GENERATED, ALERT_ACKNOWLEDGED, ALERT_RESOLVED"
        TEXT notes
        TIMESTAMPTZ timestamp "Immutable action timestamp"
    }
```

---

## 3. Canonical Table Catalog & Schema Dictionary

### Table: `zones`
Stores monitored geographic catchment zones at district and sub-district resolution.
- `id` (`UUID`, PK): Deterministic or random UUID identifier.
- `zone_id` (`VARCHAR(64)`, Unique, Indexed): Human-readable unique key (e.g., `ZONE-SIKKIM-EAST_SIKKIM`).
- `name` (`VARCHAR(128)`, Not Null): Name of catchment zone.
- `state` (`VARCHAR(64)`, Not Null, Indexed): Indian State / Union Territory.
- `district` (`VARCHAR(64)`, Not Null, Indexed): District name.
- `subdivision` (`VARCHAR(128)`, Nullable): IMD Meteorological Subdivision.
- `is_ner` (`BOOLEAN`, Not Null, Indexed): `true` if located in the North-Eastern Region of India.
- `geometry` (`GEOMETRY(MULTIPOLYGON, 4326)`, Nullable, GIST Indexed): PostGIS boundary polygon.
- `created_at`, `updated_at` (`TIMESTAMPTZ`, Not Null): Standard audit timestamps.

### Table: `zone_terrain_features`
Static terrain morphometry derived strictly from verified Digital Elevation Model (DEM) rasters.
- `id` (`UUID`, PK): Unique record identifier.
- `zone_id` (`UUID`, FK `zones.id`, Unique, Cascade Delete): 1-to-1 mapping with parent zone.
- `elevation_mean`, `elevation_min`, `elevation_max`, `elevation_std` (`DOUBLE PRECISION`, Nullable): Elevation statistics in meters. Must be `NULL` when `terrain_coverage=false`.
- `slope_mean`, `slope_min`, `slope_max`, `slope_std` (`DOUBLE PRECISION`, Nullable): Horn slope statistics in degrees. Must be `NULL` when `terrain_coverage=false`.
- `aspect_mean`, `tri_mean` (`DOUBLE PRECISION`, Nullable): Aspect in degrees and Terrain Roughness Index.
- `terrain_coverage` (`BOOLEAN`, Not Null, Default `false`): Explicit scientific coverage flag.
- `source_provenance` (`VARCHAR(64)`, Not Null): e.g. `TERRAIN_AVAILABLE` or `TERRAIN_UNAVAILABLE`.
- `updated_at` (`TIMESTAMPTZ`, Not Null): Last computation timestamp.

### Table: `data_sources`
Observational catalog tracking providers, update cadence, and connectivity health.
- `id` (`UUID`, PK): Source UUID.
- `source_id` (`VARCHAR(64)`, Unique, Indexed): e.g. `SRC-NASA-GPM-IMERG`, `SRC-IMD-NORMALS`.
- `name` (`VARCHAR(128)`, Not Null): Formal data source title.
- `provider` (`VARCHAR(64)`, Not Null): Originating agency (IMD, GSI, NASA, ISRO).
- `category` (`VARCHAR(64)`, Not Null): `CLIMATOLOGY`, `GEOLOGICAL`, `PRECIPITATION`, `TERRAIN`.
- `status` (`VARCHAR(32)`, Not Null): `CONNECTED`, `DEGRADED`, `STALE`, `OFFLINE`.
- `freshness` (`VARCHAR(32)`, Not Null): `FRESH`, `AGING`, `STALE`, `OFFLINE`.
- `provenance` (`VARCHAR(32)`, Not Null): `LIVE`, `HISTORICAL`, `CLIMATOLOGICAL`, `SIMULATED`.
- `cadence` (`VARCHAR(64)`, Nullable): Ingestion frequency description.
- `last_ingested_at` (`TIMESTAMPTZ`, Nullable): Timestamp of most recent successful sync.
- `record_count` (`INTEGER`, Nullable): Total synced records.
- `metadata` (`JSONB`, Nullable): Extended provider metadata and configuration.

### Table: `ingestion_events`
Audit log of observational pipeline ingestion runs.
- `id` (`BIGSERIAL`, PK): Auto-incrementing ingestion event identifier.
- `source_id` (`UUID`, FK `data_sources.id`, Cascade Delete, Indexed): Associated data source.
- `started_at` (`TIMESTAMPTZ`, Not Null, Indexed): Ingestion start timestamp.
- `completed_at` (`TIMESTAMPTZ`, Nullable): Ingestion completion timestamp.
- `status` (`VARCHAR(32)`, Not Null, Indexed): `SUCCESS`, `FAILED`, `RUNNING`.
- `records_ingested` (`INTEGER`, Nullable): Count of rows processed.
- `duration_ms` (`INTEGER`, Nullable): Ingestion execution duration in milliseconds.
- `message` (`TEXT`, Nullable): Diagnostic or error summary.
- `provenance` (`VARCHAR(32)`, Not Null): Data provenance tag.
- `metadata` (`JSONB`, Nullable): Ingestion payload metadata.

### Table: `sensors`
Physical and virtual observation sensors deployed across catchment zones.
- `id` (`UUID`, PK): Unique sensor UUID.
- `sensor_id` (`VARCHAR(64)`, Unique, Indexed): e.g. `SENS-ZONE-SIKKIM-EAST_SIKKIM-RAIN`.
- `zone_id` (`UUID`, FK `zones.id`, Set Null, Indexed): Associated monitored zone.
- `source_id` (`UUID`, FK `data_sources.id`, Set Null, Indexed): Associated observational data feed.
- `name` (`VARCHAR(128)`, Not Null): Sensor display name.
- `sensor_type` (`VARCHAR(64)`, Not Null): e.g. `RAINGAUGE_TELEMETERED`, `SOIL_MOISTURE_PROBE`.
- `status` (`VARCHAR(32)`, Not Null): `CONNECTED`, `DEGRADED`, `STALE`, `OFFLINE`.
- `latitude`, `longitude` (`DOUBLE PRECISION`, Nullable): WGS84 point coordinates.
- `geometry` (`GEOMETRY(POINT, 4326)`, Nullable, GIST Indexed): PostGIS point geometry.
- `installed_at` (`TIMESTAMPTZ`, Nullable): Commissioning timestamp.
- `metadata` (`JSONB`, Nullable): Hardware specs, elevation, calibration coefficients.

### Table: `telemetry_readings`
High-volume time-series observational sensor readings.
- `id` (`BIGSERIAL`, PK): Auto-incrementing time-series ID.
- `sensor_id` (`UUID`, FK `sensors.id`, Set Null, Indexed): Emitting sensor.
- `zone_id` (`UUID`, FK `zones.id`, Cascade Delete, Indexed): Catchment zone.
- `timestamp` (`TIMESTAMPTZ`, Not Null, Indexed): Observation timestamp (UTC).
- `measurement_type` (`VARCHAR(64)`, Not Null, Indexed): e.g. `rainfall_rate_mm_h`, `soil_moisture_pct`.
- `value` (`DOUBLE PRECISION`, Not Null): Observation value.
- `unit` (`VARCHAR(32)`, Not Null): Measurement unit (`mm/h`, `%`, `deg_C`).
- `provenance` (`VARCHAR(32)`, Not Null, Indexed): `LIVE`, `HISTORICAL`, `SIMULATED`.
- `metadata` (`JSONB`, Nullable): Reading-specific metadata.
- **Indexes**:
  - `(zone_id, timestamp DESC)`: Fast rolling-window time queries per zone.
  - `(sensor_id, timestamp DESC)`: Fast sensor time-series lookup.
  - `(measurement_type, timestamp DESC)`: Filter by measurement modality.
  - `(provenance)`: Filter synthetic vs. observational streams.

### Table: `risk_evaluations`
Immutable historical evaluations calculated by the `DynamicRiskEngine`.
- `id` (`BIGSERIAL`, PK): Evaluation identifier.
- `zone_id` (`UUID`, FK `zones.id`, Cascade Delete, Indexed): Evaluated catchment zone.
- `timestamp` (`TIMESTAMPTZ`, Not Null, Indexed): Evaluation timestamp.
- `static_susceptibility` (`DOUBLE PRECISION`, Nullable): Macro ML prior probability in `[0, 1]`.
- `terrain_factor` (`DOUBLE PRECISION`, Nullable): Horn slope & TRI factor in `[0, 1]`.
- `rainfall_factor` (`DOUBLE PRECISION`, Nullable): Multi-window antecedent rainfall factor in `[0, 1]`.
- `soil_factor` (`DOUBLE PRECISION`, Nullable): Soil moisture saturation factor in `[0, 1]`.
- `historical_factor` (`DOUBLE PRECISION`, Nullable): Historical incident recurrence factor in `[0, 1]`.
- `dynamic_risk_score` (`DOUBLE PRECISION`, Not Null): Weighted dynamic risk score with Check Constraint `dynamic_risk_score >= 0.0 AND dynamic_risk_score <= 1.0`.
- `severity` (`VARCHAR(32)`, Not Null, Indexed): `LOW`, `MODERATE`, `HIGH`, `CRITICAL`.
- `provenance` (`VARCHAR(32)`, Not Null, Indexed): `LIVE`, `HISTORICAL`, `SIMULATED`.
- `degraded_mode` (`BOOLEAN`, Not Null): `true` when evaluated with missing modalities.
- `degraded_reasons` (`JSONB`, Nullable): Explanatory reasons for degraded computation.
- `model_version` (`VARCHAR(64)`, Nullable): Semantic version of model and engine.
- `evidence` (`JSONB`, Not Null): Complete serialized `RiskEvidenceBundle` including dynamic weights, antecedents, and scientific disclaimer.
- **Indexes**:
  - `(zone_id, timestamp DESC)`: Retrieve zone latest risk evaluation.
  - `(severity, timestamp DESC)`: Regional emergency overview queries.
  - `(provenance)`: Distinguish simulated scenarios from real-time events.

### Table: `alerts`
Operational hazard alerts triggered upon risk threshold crossings.
- `id` (`UUID`, PK): Unique alert UUID.
- `alert_id` (`VARCHAR(64)`, Unique, Indexed): Human-readable operational ID (e.g. `ALT-2026-A1B2C3`).
- `zone_id` (`UUID`, FK `zones.id`, Cascade Delete, Indexed): Target zone.
- `risk_evaluation_id` (`BIGINT`, FK `risk_evaluations.id`, Set Null): Originating risk evaluation.
- `severity` (`VARCHAR(32)`, Not Null): `LOW`, `MODERATE`, `HIGH`, `CRITICAL`.
- `risk_score` (`DOUBLE PRECISION`, Not Null): Evaluation risk score at trigger time.
- `trigger_reason` (`TEXT`, Not Null): Scientific explanation of the hazard.
- `status` (`VARCHAR(32)`, Not Null, Default `'ACTIVE'`): `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`.
- `provenance` (`VARCHAR(32)`, Not Null): `LIVE`, `HISTORICAL`, `SIMULATED`.
- `created_at` (`TIMESTAMPTZ`, Not Null, Indexed): Alert creation timestamp.
- `acknowledged_at` (`TIMESTAMPTZ`, Nullable): Operator acknowledgment timestamp.
- `resolved_at` (`TIMESTAMPTZ`, Nullable): Resolution timestamp.
- **Indexes**:
  - `(zone_id, created_at DESC)`: Fetch zone alert history.
  - `(status, severity)`: Active critical alerts dashboard query.
  - `(created_at DESC)`: Global chronological alerts feed.

### Table: `alert_audit_history`
Append-only, immutable chronological audit trail of operator actions taken on alerts.
- `id` (`BIGSERIAL`, PK): Auto-incrementing audit log entry ID.
- `alert_id` (`UUID`, FK `alerts.id`, Cascade Delete, Indexed): Target alert.
- `operator_id` (`VARCHAR(64)`, Not Null): Acting operator or system identifier.
- `action` (`VARCHAR(64)`, Not Null): `ALERT_GENERATED`, `ALERT_ACKNOWLEDGED`, `ALERT_RESOLVED`.
- `notes` (`TEXT`, Nullable): Operational dispatch notes or rationale.
- `timestamp` (`TIMESTAMPTZ`, Not Null, Indexed): Action timestamp.
- **Index**:
  - `(alert_id, timestamp DESC)`: Ordered chronological audit log retrieval.

---

## 4. PostGIS Spatial Types, Indexing & Queries

1. **Extension Initialization**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
2. **Spatial Columns**:
   - `zones.geometry`: `GEOMETRY(MULTIPOLYGON, 4326)` with GIST index `idx_zones_geometry`.
   - `sensors.geometry`: `GEOMETRY(POINT, 4326)` with GIST index `idx_sensors_geometry`.
3. **Point-in-Polygon Spatial Intersect Query Example**:
   ```sql
   -- Find the containing zone for a telemetry GPS coordinate
   SELECT id, zone_id, name, state, district
   FROM zones
   WHERE ST_Contains(geometry, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326))
   LIMIT 1;
   ```
4. **Spatial Proximity Query Example**:
   ```sql
   -- Find active sensors within 50km of a coordinate
   SELECT sensor_id, name, ST_DistanceSphere(geometry, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) / 1000.0 AS distance_km
   FROM sensors
   WHERE ST_DWithin(geometry::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, 50000.0)
   ORDER BY distance_km ASC;
   ```

---

## 5. Provenance & Scientific Truthfulness Guarantees

1. **Missing Data Policy**:
   - When DEM rasters are unmounted or unavailable, `zone_terrain_features.terrain_coverage` is explicitly set to `false`.
   - `elevation_mean`, `slope_mean`, and `tri_mean` are set to `NULL` (never fabricated with zeros).
   - In dynamic risk evaluation, missing terrain causes `degraded_mode = true` with dynamic reweighting of available factors, and explicit logging in `degraded_reasons`.
2. **Telemetry Classification**:
   - Every telemetry reading, risk evaluation, and alert carries a canonical `provenance` tag (`LIVE`, `HISTORICAL`, `CLIMATOLOGICAL`, `SIMULATED`).
   - Synthetic telemetry from the demo simulator is clearly marked with `provenance = 'SIMULATED'`.

---

## 6. Supabase PostgreSQL & PostGIS Setup Guide

1. **Create Supabase Project**:
   - Navigate to [https://supabase.com](https://supabase.com) and create a new project `lews-production`.
2. **Enable PostGIS Extension**:
   - In Supabase SQL Editor:
     ```sql
     CREATE EXTENSION IF NOT EXISTS postgis;
     ```
3. **Obtain Connection String**:
   - Under *Project Settings -> Database*, copy the URI connection string:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
4. **Set Environment Variables on Render**:
   - Set `DATABASE_URL` = `postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

---

## 7. Migration & Seeding Runbook

1. **Run Alembic Migrations**:
   ```bash
   alembic -c apps/api/alembic.ini upgrade head
   ```
2. **Verify Migration Downgrade & Re-upgrade**:
   ```bash
   alembic -c apps/api/alembic.ini downgrade -1
   alembic -c apps/api/alembic.ini upgrade head
   ```
3. **Execute Production Async Seeder**:
   ```bash
   python -m apps.api.app.seed
   ```
4. **Inspect Seeded State**:
   ```bash
   python -c "
   import asyncio
   from sqlalchemy import select, func
   from apps.api.app.db.session import AsyncSessionLocal
   from apps.api.app.db.models.zone import Zone
   from apps.api.app.db.models.data_source import DataSourceModel

   async def check():
       async with AsyncSessionLocal() as s:
           z_count = await s.scalar(select(func.count(Zone.id)))
           s_count = await s.scalar(select(func.count(DataSourceModel.id)))
           print(f'Seeded Zones: {z_count}, Data Sources: {s_count}')

   asyncio.run(check())
   "
   ```
