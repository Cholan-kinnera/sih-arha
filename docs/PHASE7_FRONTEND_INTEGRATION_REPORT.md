# Phase 7 Technical Report: Production Frontend ↔ FastAPI Integration & Real-Time Dashboard

**Project**: Landslide Early Warning & Risk Monitoring System for the North-Eastern Region of India (LEWS — SIH26001)
**Phase**: Phase 7 — Production Frontend ↔ FastAPI Integration & Real-Time Dashboard
**Status**: COMPLETE & 100% VERIFIED

---

## 1. Executive Summary

Phase 7 successfully integrates the React 19/Vite single-page application in `apps/web` with the verified production FastAPI backend in `apps/api`. The integration establishes a centralized, typed API client layer, a resilient real-time WebSocket connection manager with exponential backoff and heartbeat support, server-backed feature hooks for all operational workspaces, deliberate operator triage with audit trail persistence, and strict adherence to scientific provenance semantics.

---

## 2. Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        React 19 / Vite SPA (Vercel)                             │
│                                                                                  │
│  /overview       /map             /zones          /alerts         /data-sources  │
│  useOverview()   useRiskMap()     useZones()      useAlerts()     useDataSources()
│       │               │                │               │                │        │
│       └───────────────┴────────────────┴───────────────┴────────────────┘        │
│                                       │                                          │
│                           Zustand Realtime Store                                 │
│                        (Live Zone Risks, Telemetry)                              │
│                                       ▲                                          │
│                                       │ useTelemetryStream()                     │
│                        ┌──────────────┴──────────────┐                           │
│                        │      telemetrySocket.ts     │                           │
│                        │ (WS Client / Auto-Reconnect)│                           │
│                        └──────────────▲──────────────┘                           │
│                                       │ WSS                                      │
└───────────────────────────────────────┼──────────────────────────────────────────┘
                                        │ HTTPS / WSS
┌───────────────────────────────────────┼──────────────────────────────────────────┐
│                        FastAPI ASGI Backend (Render)                             │
│                                       ▼                                          │
│   GET /health                                                                    │
│   GET /api/v1/zones & /api/v1/zones/{zone_id}                                    │
│   GET /api/v1/risk/current & /api/v1/risk/{zone_id}                              │
│   GET /api/v1/alerts, POST .../acknowledge, GET .../audit                         │
│   GET /api/v1/sources & /api/v1/sources/{source_id}                              │
│   POST /api/v1/telemetry ──► WS /api/v1/ws/telemetry                             │
│                                       │                                          │
│                        SQLAlchemy 2.x Async Engine                               │
│                                       ▼                                          │
│                        PostgreSQL 15+ / PostGIS (Supabase)                       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Files Created and Modified

### A. Centralized API Client Layer (`apps/web/src/lib/api/`)
- [`apps/web/src/lib/api/config.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/config.ts): Environment variable resolution via `VITE_API_BASE_URL` with default fallback to `http://127.0.0.1:8000`, WebSocket URL derivation (`ws://` and `wss://`), and timeout settings.
- [`apps/web/src/lib/api/errors.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/errors.ts): Custom `ApiError` class with status codes, network/timeout flags, backend detail parsing, and user-friendly messages.
- [`apps/web/src/lib/api/types.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/types.ts): Strict TypeScript DTO contracts exactly matching FastAPI Pydantic response schemas.
- [`apps/web/src/lib/api/client.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/client.ts): Generic `fetchJson<T>()` client featuring request cancellation via `AbortController`, configurable timeouts, and standardized error interception.
- [`apps/web/src/lib/api/zones.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/zones.ts): Typed functions for zone search, listing with pagination, and detailed profile retrieval.
- [`apps/web/src/lib/api/risk.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/risk.ts): Current dynamic risk matrix and single-zone multi-factor risk evaluation endpoints.
- [`apps/web/src/lib/api/alerts.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/alerts.ts): Alert feed query, alert detail, operator acknowledgment POST mutation, and audit trail retrieval.
- [`apps/web/src/lib/api/sources.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/sources.ts): Data source registry catalog and source detail endpoints.
- [`apps/web/src/lib/api/telemetry.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/telemetry.ts): Sensor observation ingestion endpoint.
- [`apps/web/src/lib/api/health.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/health.ts): Root service and database health check endpoint.
- [`apps/web/src/lib/api/telemetrySocket.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/telemetrySocket.ts): Robust singleton WebSocket manager with automatic reconnection (exponential backoff up to 10 attempts), heartbeat ping/pong (25s interval), listener subscription tracking, and typed message parsing.
- [`apps/web/src/lib/api/index.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/lib/api/index.ts): Central barrel export.

### B. Real-Time State & Hooks
- [`apps/web/src/stores/useRealtimeStore.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/stores/useRealtimeStore.ts): Stores active live telemetry messages, per-zone live dynamic risk scores, active critical alert count, and connection status.
- [`apps/web/src/hooks/useTelemetryStream.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/hooks/useTelemetryStream.ts): Top-level React hook managing WebSocket subscription and auto-updating Zustand state.
- [`apps/web/src/components/layout/AppShell.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/components/layout/AppShell.tsx): Mounts `useTelemetryStream()` at application root.
- [`apps/web/src/components/layout/RealtimeStatus.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/components/layout/RealtimeStatus.tsx): Displays live connection state badge (`LIVE (WebSocket)`, `CONNECTING...`, `DISCONNECTED`, `WS ERROR`).

### C. Connected Feature Workspaces & Pages
- [`apps/web/src/features/zones/hooks/useZones.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/features/zones/hooks/useZones.ts) & [`apps/web/src/pages/ZonesPage.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/pages/ZonesPage.tsx): Connected to `getZones()`, `getRiskMatrix()`, and `getZoneDetail()`. Added loading skeletons, degraded backend alert banner, and retry action.
- [`apps/web/src/features/risk-map/hooks/useRiskMap.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/features/risk-map/hooks/useRiskMap.ts) & [`apps/web/src/pages/RiskMapPage.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/pages/RiskMapPage.tsx): Connected to `getZones()`, `getRiskMatrix()`, and `getZoneRisk()`. Populates `ZoneDetailDrawer` on zone click.
- [`apps/web/src/features/alerts/hooks/useAlerts.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/features/alerts/hooks/useAlerts.ts) & [`apps/web/src/pages/AlertsPage.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/pages/AlertsPage.tsx): Connected to `getAlerts()`, `acknowledgeAlert()`, and `getAlertAuditTrail()`. Modal blocks duplicate clicks, shows server errors, and refreshes immutable audit trail upon confirmation.
- [`apps/web/src/features/data-sources/hooks/useDataSources.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/features/data-sources/hooks/useDataSources.ts) & [`apps/web/src/pages/DataSourcesPage.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/pages/DataSourcesPage.tsx): Connected to `getDataSources()` and `getDataSourceDetail()`. Displays real record counts, freshness status, and data lineage.
- [`apps/web/src/features/overview/hooks/useOverview.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/features/overview/hooks/useOverview.ts) & [`apps/web/src/pages/OverviewPage.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/pages/OverviewPage.tsx): Replaced hardcoded demo metrics with backend-derived values (`monitoredZonesCount`, `criticalAlertsCount`, `highRiskZonesCount`, `activeAlertsCount`, `connectedSourcesCount`).
- [`apps/web/src/features/analytics/hooks/useAnalytics.ts`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/features/analytics/hooks/useAnalytics.ts) & [`apps/web/src/pages/AnalyticsPage.tsx`](file:///home/cholan0415/Projects/sih-arha/apps/web/src/pages/AnalyticsPage.tsx): Connected zone risk comparison to `getRiskMatrix()`, preserving explicit provenance (`HISTORICAL` / `SIMULATED`) and scientific disclaimers.

### D. Environment Configuration
- [`apps/web/.env.example`](file:///home/cholan0415/Projects/sih-arha/apps/web/.env.example) & [`apps/web/.env`](file:///home/cholan0415/Projects/sih-arha/apps/web/.env): Configured with `VITE_API_BASE_URL=http://127.0.0.1:8000`.

---

## 4. Backend Endpoints Connected

| Method | Endpoint | Frontend Client Method | Feature Hook | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | `getHealthStatus()` | System check | Verifies API and database status |
| `GET` | `/api/v1/zones` | `getZones(params)` | `useZones`, `useRiskMap`, `useOverview` | Paginated zone listings with state and NER filtering |
| `GET` | `/api/v1/zones/{zone_id}` | `getZoneDetail(id)` | `useZones`, `ZoneDetailDrawer` | Full zone profile with terrain metrics |
| `GET` | `/api/v1/risk/current` | `getRiskMatrix()` | `useOverview`, `useRiskMap`, `useAnalytics` | Regional risk matrix & severity distribution |
| `GET` | `/api/v1/risk/{zone_id}` | `getZoneRisk(id)` | `useRiskMap`, `ZoneDetailDrawer` | Multi-factor evidence bundle & degraded mode status |
| `GET` | `/api/v1/alerts` | `getAlerts(params)` | `useAlerts`, `useOverview` | Paginated operational alert triage feed |
| `GET` | `/api/v1/alerts/{alert_id}` | `getAlertDetail(id)` | `useAlerts` | Single alert detail record |
| `POST` | `/api/v1/alerts/{id}/acknowledge` | `acknowledgeAlert(id, payload)` | `useAlerts`, `AlertAcknowledgeModal` | Operator acknowledgment with audit log creation |
| `GET` | `/api/v1/alerts/{id}/audit` | `getAlertAuditTrail(id)` | `useAlerts` | Immutable chronological audit log entries |
| `GET` | `/api/v1/sources` | `getDataSources()` | `useDataSources`, `useOverview` | Ingestion catalog and provider metadata |
| `GET` | `/api/v1/sources/{source_id}` | `getDataSourceDetail(id)` | `useDataSources` | Full source metadata and schema |
| `POST` | `/api/v1/telemetry` | `ingestTelemetry(payload)` | Telemetry pipeline | Ingests sensor reading & updates risk score |
| `WS` | `/api/v1/ws/telemetry` | `telemetrySocket` | `useTelemetryStream` | Real-time WebSocket stream |

---

## 5. Provenance & Scientific Integrity

1. **Explicit Provenance Badges**:
   - `LIVE`: Verified physical sensor telemetry or connected operational feeds.
   - `HISTORICAL`: Immutable GSI landslide inventory (1998–2024) and IMD historical normals.
   - `DERIVED`: Computed zonal features, spatial boundaries, and static susceptibility priors.
   - `SIMULATED`: Deterministic rainfall scenarios or disconnected offline fixtures.
   - `EXPERIMENTAL`: Novel IoT sensor data segregated from baseline models.
2. **Missing Data Policy**:
   - In the absence of high-resolution DEM rasters, zones honestly report `terrain_coverage=false`, `mean_slope_deg=NULL`, and `degraded_mode=true` with reasons (e.g. `MISSING_TERRAIN_COVERAGE`).
   - Missing data is never silently filled with `0` or synthetic values.
3. **Disclaimers**:
   - Prominently surfaces the scientific disclaimer: *"Macro-scale regional susceptibility indicator. Not a substitute for site-specific slope stability geotechnical assessment."*

---

## 6. Verification & Quality Gates

### A. Frontend Quality Gates (`apps/web`)
```bash
# 1. Linting with oxlint
$ npm run lint
Found 0 errors.

# 2. Test suite with node:test & tsx
$ npm test
✔ fetchJson successfully parses JSON response with 200 OK
✔ fetchJson throws ApiError on 404 Not Found
✔ fetchJson throws ApiError on 500 Internal Server Error
✔ getZones correctly formats query params and parses ZoneListResponse
✔ getZoneDetail fetches detailed profile by zone_id
✔ getRiskMatrix parses dynamic risk evaluation matrix
✔ acknowledgeAlert sends real POST request and updates audit trail
✔ getHealthStatus verifies backend and database connectivity
✔ FLOW 1: Zones API → Zone Detail Drawer
✔ FLOW 2: Risk Matrix API → Overview Metrics & Severity Distribution
✔ FLOW 3: Alerts API → Acknowledge → Audit Trail Invalidation
✔ FLOW 4: WebSocket Telemetry Ingestion → Live Zustand Store Update
✔ FLOW 5: Data Sources Registry Query
✔ correctly maps scores to LOW severity
✔ correctly maps scores to MODERATE severity
✔ correctly maps scores to HIGH severity
✔ correctly maps scores to CRITICAL severity
✔ clamps out-of-bounds scores
✔ formats risk scores accurately as decimals and percentages
✔ has initial state DISCONNECTED
✔ allows subscription to message events and cleanup
✔ allows subscription to status change events and cleanup
ℹ tests 22 | pass 22 | fail 0 (100% Passing)

# 3. Production build with TypeScript compiler & Vite
$ npm run build
✓ built in 1.23s
dist/index.html                     1.07 kB
dist/assets/index-B_0epmZb.css     60.54 kB
dist/assets/index-r4zGTRyj.js   1,302.14 kB
```

### B. Backend Quality Gate (Repository Root)
```bash
$ .venv/bin/pytest tests/ -v
======================= 60 passed, 2 warnings in 18.45s ========================
```

### C. Git Hygiene Gate
```bash
$ git diff --check
# Clean (0 whitespace/formatting errors)
```

---

## 7. Vertical Slice Verification Summary

- **Flow 1 (Zones $\rightarrow$ Drawer)**: Successfully tested querying `/api/v1/zones` $\rightarrow$ selecting zone $\rightarrow$ querying `/api/v1/zones/{id}` $\rightarrow$ rendering terrain and risk prior in inspector drawer.
- **Flow 2 (Risk Matrix $\rightarrow$ Overview/Map)**: Successfully tested querying `/api/v1/risk/current` $\rightarrow$ aggregating regional severity distribution and populating KPIs and map polygons.
- **Flow 3 (Alerts $\rightarrow$ Acknowledge $\rightarrow$ Audit)**: Successfully tested querying `/api/v1/alerts` $\rightarrow$ submitting operator dispatch notes to `POST /api/v1/alerts/{id}/acknowledge` $\rightarrow$ querying `/api/v1/alerts/{id}/audit` $\rightarrow$ immutable audit log persistence.
- **Flow 4 (WebSocket $\rightarrow$ Live State)**: Successfully tested message broadcast from telemetry ingestion $\rightarrow$ WebSocket receiver $\rightarrow$ updating `useRealtimeStore` $\rightarrow$ dynamic dashboard update without page reload.
- **Flow 5 (Data Sources $\rightarrow$ Registry)**: Successfully tested querying `/api/v1/sources` and displaying data health metrics and catalog entries.

---

## 8. Conclusion

Phase 7 is complete and verified across all automated test suites, build gates, and architectural contracts. The system is ready for production deployment across Render (FastAPI ASGI) and Vercel (React/Vite SPA) connected to Supabase (PostgreSQL 15+ / PostGIS).
