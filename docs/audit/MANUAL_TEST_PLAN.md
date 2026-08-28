# LEWS Manual Engineering Test & Verification Plan

This document contains step-by-step manual procedures to verify the complete LEWS system end-to-end.

---

### A. Database Initialization & PostGIS Service
- **TEST ID**: `MAN-001`
- **Purpose**: Verify that the database service is running and accessible.
- **Preconditions**: Docker daemon is active or PostgreSQL is running.
- **Action**: Run `docker compose up -d postgres` or check local PostgreSQL service.
- **Expected Result**: Database service is healthy and accepts connections on port 5432.
- **Status**: [ ] Pass [ ] Fail

---

### B. Alembic Migrations Execution
- **TEST ID**: `MAN-002`
- **Purpose**: Verify schema creation and migration lifecycle.
- **Preconditions**: `DATABASE_URL` is set to target PostgreSQL instance.
- **Action**: `.venv/bin/alembic -c apps/api/alembic.ini upgrade head`
- **Expected Result**: Migrations apply successfully; creates `zones`, `sensors`, `telemetry_readings`, `risk_evaluations`, `alerts`, `alert_audit_history`, `data_sources`, and `ingestion_events` tables.
- **Status**: [ ] Pass [ ] Fail

---

### C. Canonical Database Seeder
- **TEST ID**: `MAN-003`
- **Purpose**: Seed canonical 641 district zones, 5 data sources, and initial risk matrix.
- **Preconditions**: Migrations applied.
- **Action**: `.venv/bin/python -m apps.api.app.seed`
- **Expected Result**: Outputs `Seeded 641 zones`, `5 data sources`, and initial telemetry evaluations without errors.
- **Status**: [ ] Pass [ ] Fail

---

### D. FastAPI Backend Service Launch
- **TEST ID**: `MAN-004`
- **Purpose**: Start ASGI server.
- **Action**: `.venv/bin/uvicorn apps.api.app.main:app --host 127.0.0.1 --port 8000`
- **Expected Result**: Server starts on `http://127.0.0.1:8000` with lifespan startup completed.
- **Status**: [ ] Pass [ ] Fail

---

### E. Swagger OpenAPI UI Check
- **TEST ID**: `MAN-005`
- **Purpose**: Inspect OpenAPI interactive documentation.
- **Action**: Open browser at `http://127.0.0.1:8000/docs`
- **Expected Result**: Interactive Swagger UI renders all routes under Health, Zones, Risk, Alerts, Data Sources, and Telemetry.
- **Status**: [ ] Pass [ ] Fail

---

### F. Health Endpoint Validation
- **TEST ID**: `MAN-006`
- **Purpose**: Verify system and database connectivity status.
- **Action**: `curl -s http://127.0.0.1:8000/health`
- **Expected Result**: `{"status":"healthy","database":"connected","version":"0.1.0"}` with HTTP 200.
- **Status**: [ ] Pass [ ] Fail

---

### G. Zones Directory & Filter Query
- **TEST ID**: `MAN-007`
- **Purpose**: Query paginated zones with NER filter.
- **Action**: `curl -s "http://127.0.0.1:8000/api/v1/zones?is_ner=true&page=1&page_size=10"`
- **Expected Result**: Returns `total: 87`, `page: 1`, and a list of 10 NER district zones.
- **Status**: [ ] Pass [ ] Fail

---

### H. Zone Profile & Terrain Inspection
- **TEST ID**: `MAN-008`
- **Purpose**: Retrieve comprehensive single-zone profile.
- **Action**: `curl -s "http://127.0.0.1:8000/api/v1/zones/ZONE-SIKKIM-EAST_SIKKIM"` (or any valid ID from step G).
- **Expected Result**: Returns zone profile with static susceptibility prior and terrain status.
- **Status**: [ ] Pass [ ] Fail

---

### I. Current Dynamic Risk Matrix
- **TEST ID**: `MAN-009`
- **Purpose**: Retrieve full regional risk evaluation matrix.
- **Action**: `curl -s "http://127.0.0.1:8000/api/v1/risk/current"`
- **Expected Result**: Returns `timestamp_utc`, `severity_distribution`, and an array of `evaluations`.
- **Status**: [ ] Pass [ ] Fail

---

### J. Operational Alerts Queue
- **TEST ID**: `MAN-010`
- **Purpose**: Query active operational alerts.
- **Action**: `curl -s "http://127.0.0.1:8000/api/v1/alerts?status=ACTIVE"`
- **Expected Result**: Returns list of unacknowledged operational alerts.
- **Status**: [ ] Pass [ ] Fail

---

### K. Alert Acknowledge Mutation
- **TEST ID**: `MAN-011`
- **Purpose**: Submit operator triage notes for an active alert.
- **Action**:
  ```bash
  curl -X POST "http://127.0.0.1:8000/api/v1/alerts/{alert_id}/acknowledge" \
    -H "Content-Type: application/json" \
    -d '{"operator_id":"OP-412","notes":"Patrol deployed to sector."}'
  ```
- **Expected Result**: Returns updated alert with `status: "ACKNOWLEDGED"` and `acknowledged_at` timestamp.
- **Status**: [ ] Pass [ ] Fail

---

### L. Alert Audit History Verification
- **TEST ID**: `MAN-012`
- **Purpose**: Verify immutable audit entry persistence.
- **Action**: `curl -s "http://127.0.0.1:8000/api/v1/alerts/{alert_id}/audit"`
- **Expected Result**: Returns audit array containing the newly logged acknowledgment action.
- **Status**: [ ] Pass [ ] Fail

---

### M. Telemetry Ingestion Flow
- **TEST ID**: `MAN-013`
- **Purpose**: Ingest simulated rainfall telemetry reading.
- **Action**:
  ```bash
  curl -X POST "http://127.0.0.1:8000/api/v1/telemetry" \
    -H "Content-Type: application/json" \
    -d '{"sensor_id":"AWS-MANUAL-01","zone_id":"ZONE-SIKKIM-EAST_SIKKIM","measurement_type":"rainfall_rate_mm_h","value":75.0,"unit":"mm/h","provenance":"SIMULATED"}'
  ```
- **Expected Result**: Returns `status: "INGESTED_SUCCESSFULLY"`, `zone_risk_updated: true`, and updated `dynamic_risk_score`.
- **Status**: [ ] Pass [ ] Fail

---

### N. WebSocket Stream Connection
- **TEST ID**: `MAN-014`
- **Purpose**: Connect live WebSocket client and verify message reception.
- **Action**: Connect using `wscat -c ws://127.0.0.1:8000/api/v1/ws/telemetry` or browser client, then trigger step M.
- **Expected Result**: Receives `{"type":"TELEMETRY_UPDATE", "zone_id":"ZONE-SIKKIM-EAST_SIKKIM", ...}` immediately over socket.
- **Status**: [ ] Pass [ ] Fail

---

### O. Frontend SPA Launch
- **TEST ID**: `MAN-015`
- **Purpose**: Launch Vite frontend dev server.
- **Action**: `cd apps/web && npm run dev`
- **Expected Result**: Vite launches on `http://localhost:5173`.
- **Status**: [ ] Pass [ ] Fail

---

### P. Frontend API Connection & Top Header
- **TEST ID**: `MAN-016`
- **Purpose**: Verify frontend connection badge and metrics.
- **Action**: Navigate to `http://localhost:5173/overview`
- **Expected Result**: Top header displays `LIVE (WebSocket)` badge with emerald pulse dot.
- **Status**: [ ] Pass [ ] Fail

---

### Q. Risk Map Workspace Navigation
- **TEST ID**: `MAN-017`
- **Purpose**: Verify geospatial Leaflet map and layer controls.
- **Action**: Navigate to `/map` and toggle layer checkboxes (Hazard Polygons, IMD Rain Mesh).
- **Expected Result**: Map renders interactive catchments; selecting a zone opens the `ZoneDetailDrawer`.
- **Status**: [ ] Pass [ ] Fail

---

### R. Zone Directory & Search
- **TEST ID**: `MAN-018`
- **Purpose**: Test zone search and triage table.
- **Action**: Navigate to `/zones` and search for "Aizawl" or "Shillong".
- **Expected Result**: Instant client-side/server-side filtering; priority grid highlights top at-risk sectors.
- **Status**: [ ] Pass [ ] Fail

---

### S. Alerts Operations Console & Acknowledgment UI
- **TEST ID**: `MAN-019`
- **Purpose**: Test operator acknowledgment confirmation modal in browser.
- **Action**: Navigate to `/alerts`, click **Acknowledge Alert**, enter notes in modal, and click **Confirm**.
- **Expected Result**: Button enters loading spinner, alert row updates to `ACKNOWLEDGED`, and drawer audit log reflects the entry.
- **Status**: [ ] Pass [ ] Fail

---

### T. Data Sources Registry Lineage
- **TEST ID**: `MAN-020`
- **Purpose**: Verify data sources directory and health metrics.
- **Action**: Navigate to `/data-sources`
- **Expected Result**: Renders 5 registered providers (IMD, GSI, CWC, ISRO Bhuvan, Experimental) with real status badges.
- **Status**: [ ] Pass [ ] Fail

---

### U. Analytics Visualizations & Disclaimers
- **TEST ID**: `MAN-021`
- **Purpose**: Verify analytical charts and scientific disclaimers.
- **Action**: Navigate to `/analytics`
- **Expected Result**: Renders 72h Trajectory, Caine Threshold, Zone Comparison, and Soil Saturation charts with explicit provenance tags (`HISTORICAL` / `SIMULATED`).
- **Status**: [ ] Pass [ ] Fail

---

### V. Browser Console Cleanliness
- **TEST ID**: `MAN-022`
- **Purpose**: Check browser DevTools console.
- **Action**: Open Chrome/Firefox DevTools on all pages.
- **Expected Result**: Zero uncaught JavaScript errors, zero broken asset 404s.
- **Status**: [ ] Pass [ ] Fail

---

### W. Responsive Layout Verification
- **TEST ID**: `MAN-023`
- **Purpose**: Verify mobile & tablet layout.
- **Action**: Toggle mobile device emulation (375px / 768px).
- **Expected Result**: Layout condenses cleanly, sidebar collapses into mobile navigation, tables remain scrollable.
- **Status**: [ ] Pass [ ] Fail

---

### X. Degraded Offline Mode Verification
- **TEST ID**: `MAN-024`
- **Purpose**: Test UI resilience when backend service is stopped.
- **Action**: Stop FastAPI server (Ctrl+C), refresh browser.
- **Expected Result**: Top bar switches to `DISCONNECTED`; pages display amber banner *"Backend Connectivity Degraded: Unable to connect to live API. Showing cached/simulated baseline metrics."* with an interactive **[Retry Connection]** button.
- **Status**: [ ] Pass [ ] Fail
