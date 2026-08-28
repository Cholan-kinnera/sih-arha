# LEWS — Local Pre-Deployment Smoke Test Report

**System**: Landslide Early Warning & Risk Monitoring System for the North-Eastern Region (NER) of India
**System Code**: SIH26001 / SIH-ARHA
**Test Date**: 2026-08-29
**Execution Environment**: Local Production-Like Emulation (FastAPI ASGI + PostgreSQL 16 / PostGIS 3.4 + React 19 / Vite SPA)
**Final Status**: 🟢 **LOCAL MVP VERIFIED — READY FOR CLOUD DEPLOYMENT**

---

## 1. Executive Summary & Verification Gate

A complete, live end-to-end smoke test was executed against real runtime services (Docker PostgreSQL/PostGIS, Uvicorn ASGI, and Vite SPA) without mock APIs or simulated responses. Every functional layer was exercised from physical/simulated sensor ingestion through ML inference, multi-factor risk computation, database persistence, WebSocket streaming, and live frontend workspace rendering.

---

## 2. Phase 1 — Environment & Repository Integrity

| Check Item | Target | Verified Status |
| :--- | :--- | :--- |
| **Python Virtualenv** | Python 3.14.6 in `.venv/` | ✅ Active & Functional |
| **Processed Data Artifacts** | `data/processed/lews_baseline_dataset.parquet`<br>`data/processed/terrain_zone_features.parquet` | ✅ Verified Present (126 KB & 16 KB) |
| **ML Model Artifacts** | `ml/artifacts/baseline_susceptibility_model.joblib`<br>`ml/artifacts/model_metadata.json`<br>`ml/artifacts/feature_schema.json` | ✅ Verified Present (174 KB Pipeline, 4.5 KB Metadata, 2.0 KB Schema) |
| **Raw Data Immutability** | `data/raw/` (GSI landslides, IMD rainfall) | ✅ Read-only & untouched |
| **Secret Tracking Hygiene** | `.env`, `apps/api/.env`, `apps/web/.env` | ✅ Untracked by Git (verified via `.gitignore`) |

---

## 3. Phase 2 — Database & Schema Migration

- **Engine**: PostgreSQL 16 with PostGIS 3.4 (`postgis/postgis:16-3.4` container on host port `5435`).
- **Alembic Migration**: `001_initial_schema` upgraded cleanly to `head`.
- **Spatial Geometry**:
  - `zones.geometry`: `MULTIPOLYGON` with `SRID=4326` and spatial GIST index `idx_zones_geometry`.
  - `sensors.geometry`: `POINT` with `SRID=4326` and spatial GIST index `idx_sensors_geometry`.
- **Seed Execution**: `.venv/bin/python -m apps.api.app.seed` executed asynchronously with asyncpg.

### Verified Database Row Counts
- `zones`: **641**
  - `zones_ner_true`: **87** (NER focal districts)
  - `zones_ner_false`: **554** (Benchmark districts)
- `zone_terrain_features`: **641** (All `terrain_coverage=false` truthful degraded status)
- `data_sources`: **5** canonical feeds
- `sensors`: **8** stations
- `telemetry_readings`: **296** (Seed baseline + test ingestion)
- `risk_evaluations`: **7**
- `alerts`: **2** (`ALT-2026-02FF46` and `ALT-2026-9ABE69`)
- `alert_audit_history`: **3** immutable audit log entries

---

## 4. Phase 3 — FastAPI Backend REST Endpoints

Tested against live Uvicorn ASGI server connected to PostgreSQL:

| Endpoint | Method | Response Status | Verified Payload Elements |
| :--- | :--- | :--- | :--- |
| `/health` | `GET` | `200 OK` | `{"status":"healthy","database":"connected","version":"0.1.0"}` |
| `/api/v1/zones` | `GET` | `200 OK` | Paginated listing (641 total zones, 87 NER tagged) |
| `/api/v1/zones/{zone_id}` | `GET` | `200 OK` | Zone geometry, terrain metadata, static prior, current risk |
| `/api/v1/risk/current` | `GET` | `200 OK` | Regional severity distribution and active risk matrix |
| `/api/v1/risk/{zone_id}` | `GET` | `200 OK` | Contributing factors, factor weights, and scientific disclaimer |
| `/api/v1/sources` | `GET` | `200 OK` | 5 registered feeds (IMD Normals, GSI, NASA GPM, ISRO Bhuvan) |
| `/api/v1/alerts` | `GET` | `200 OK` | Active hazard alerts with trigger rationales |
| `/api/v1/alerts/{id}/acknowledge` | `POST` | `200 OK` | Updates status to `ACKNOWLEDGED` and creates audit row |
| `/api/v1/alerts/{id}/audit` | `GET` | `200 OK` | Audit history with operator notes and UTC timestamps |
| `/api/v1/telemetry` | `POST` | `201 CREATED` | Ingests reading, triggers dynamic risk update, broadcasts to WS |

---

## 5. Phase 4 — ML Runtime Verification

- **Champion Model Artifact**: `baseline_susceptibility_model.joblib`
- **Model Version**: `lews-susceptibility-baseline-v1.0.0`
- **Predictor Class**: `SusceptibilityPredictor` (Pipeline wrapper)
- **Feature Validation**: Strict zero-leakage schema validation excluding labels/IDs.
- **Inference Verification**:
  - Sample Zone: `ZONE-SIKKIM-EAST_SIKKIM`
  - Computed ML Prior ($S_{\text{static}}$): **0.9994** ($0.0 \le S_{\text{static}} \le 1.0$)
  - Prior Tier: **CRITICAL**
  - Seamlessly passed into `DynamicRiskEngine` as static baseline contribution.

---

## 6. Phase 5 — Dynamic Risk Engine & Scenario Verification

Tested rolling window accumulations ($1\text{h}, 6\text{h}, 24\text{h}, 48\text{h}, 72\text{h}$) and factor synthesis:

| Scenario | Inputs | Dynamic Risk Score | Severity Level | Degraded Mode |
| :--- | :--- | :--- | :--- | :--- |
| **BASELINE_DRY** | $0.0\,\text{mm}$ rainfall, $15\%$ soil moisture | **0.5531** | `MODERATE` | `True` (`TERRAIN_DATA_UNAVAILABLE`) |
| **MODERATE_SHOWERS** | $2.5\,\text{mm/h}$ ($60\,\text{mm}/24\text{h}$), $55\%$ soil | **0.7281** | `HIGH` | `True` (`TERRAIN_DATA_UNAVAILABLE`) |
| **HEAVY_MONSOON_BURST** | $15.0\,\text{mm/h}$ ($375\,\text{mm}/24\text{h}$), $95\%$ soil | **0.9931** | `CRITICAL` | `True` (`TERRAIN_DATA_UNAVAILABLE`) |

- **Factor Weights Rebalancing**: When terrain metrics are missing, weights are rebalanced deterministically across active factors ($\sum w_i = 1.0$) without fabricating data.

---

## 7. Phase 6 — WebSocket Live Telemetry Streaming

- **Endpoint**: `WS /api/v1/ws/telemetry`
- **Connection Test**: Connected live WebSocket client, sent `"ping"` and received `"pong"`.
- **Event Dispatch**: Executing `POST /api/v1/telemetry` triggered instant dispatch of `TELEMETRY_UPDATE` event payload containing `zone_id`, `dynamic_risk_score`, and `severity_level` to all connected clients.

---

## 8. Phase 7 & 8 — Real Frontend & Real-Time Flow

Tested all 6 primary frontend workspaces in Chrome DevTools against live local backend:

1. **`/overview`**: Displays KPI cards (641 monitored zones, active alerts badge, regional risk score) and live WebSocket status indicator (`LIVE (WebSocket)`).
2. **`/map`**: Renders dynamic risk map with zone drawer selection and telemetry overlays.
3. **`/zones`**: Renders full 641 zone catalog with search filtering, NER badge tags, and pagination.
4. **`/alerts`**: Displays active hazard alerts queue, acknowledgment modal, and triage audit timeline.
5. **`/data-sources`**: Displays 5 configured feeds, ingestion health statistics, and lineage drawer.
6. **`/analytics`**: Renders multi-factor risk trajectory charts and zone comparison matrices.

### Real-Time Ingestion Loop Test
```
SIMULATED Telemetry (POST /api/v1/telemetry)
        ↓
PostgreSQL telemetry_readings (Row #296)
        ↓
DynamicRiskEngine Evaluation (Risk: 0.98, CRITICAL)
        ↓
Alert Generation (ALT-2026-9ABE69)
        ↓
WebSocket Broadcast (ws://127.0.0.1:8001/api/v1/ws/telemetry)
        ↓
Zustand Realtime Store (React 19)
        ↓
Live Badge & Alert Feed Update (No page refresh required)
```

---

## 9. Phase 9 — Database Persistence Verification

Direct SQL queries to PostgreSQL confirmed:
- Ingested telemetry readings are persisted with exact UTC timestamps and `SIMULATED` provenance.
- Evaluated dynamic risk scores and JSON evidence bundles are persisted in `risk_evaluations`.
- Triggered alerts and operator triage actions are recorded in `alert_audit_history`.

---

## 10. Phase 10 — Failure & Degraded Mode Resilience

1. **Invalid Zone Query**: `GET /api/v1/zones/ZONE-NONEXISTENT-999` returns `HTTP 404 Not Found`.
2. **Invalid Telemetry Input**: `POST /api/v1/telemetry` with negative rainfall rate (`-15.0`) returns `HTTP 422 Unprocessable Content`.
3. **Missing Elevation Raster**: Degraded mode is transparently flagged in API responses and frontend badges with `TERRAIN_DATA_UNAVAILABLE` reason.
4. **Network / Backend Outage**: React frontend presents clean, non-crashing banner with manual retry capability.

---

## 11. Phase 11 — Regression Test Summary

- **Python Test Suite**: **60 passed, 0 failed** in 13.63s (`.venv/bin/pytest tests/ -v`).
- **Frontend Test Suite**: **22 passed, 0 failed** (`npm test`).
- **Frontend Linter**: **0 errors, 0 warnings** (`npm run lint`).
- **Frontend Production Build**: **Passed** in 1.21s (`npm run build`).

---

## 12. Known Warnings & Upstream Notices

1. **Starlette Deprecation Notice**: Upstream `StarletteDeprecationWarning: Using httpx with starlette.testclient is deprecated` during test runs (harmless upstream notice, does not affect production).
2. **Vite Bundle Size Notice**: Single chunk warning for combined dashboard assets (standard for comprehensive map/chart visualization bundle).

---

## 13. Conclusion & Cloud Readiness Gate

All 11 verification phases have passed with complete functional fidelity, zero architectural deviations, truthful degraded mode semantics, and live real-time synchronization.

**Deployment Recommendation**: **PROCEED TO PHASE 8 CLOUD DEPLOYMENT (Supabase + Render + Vercel)**.
