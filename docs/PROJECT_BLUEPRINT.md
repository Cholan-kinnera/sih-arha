# Master Project Blueprint

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

> **Document Status**: Master Architecture & Technical Specification
> **Target Audience**: Core Engineering Team, Domain Researchers, Evaluators

---

## 1. Project Objective

Landslides represent one of the most destructive natural hazards in mountainous terrains, causing catastrophic loss of life, infrastructure damage, and economic disruption. Early detection and continuous hazard monitoring are critical for mitigation.

The primary objective of this project is to build an **intelligent, explainable, and real-time Landslide Early Warning and Risk Monitoring Platform**. The platform integrates multi-source geospatial data (Digital Elevation Models, slope, soil composition), real-time meteorological observations (antecedent rainfall, precipitation intensity), and hydro-geological risk models to:
- Dynamically evaluate landslide hazard levels across monitored spatial zones.
- Deliver transparent, factor-driven risk explanations to disaster management operators.
- Broadcast low-latency early warning alerts to enable timely preventative action.
- Provide a responsive spatial-temporal dashboard for situation awareness and scenario simulation.

---

## 2. Product Definition

This system is explicitly defined as:
**A specialized disaster-risk monitoring and early-warning proof-of-concept (PoC) / operational prototype for emergency management authorities and technical operators.**

It is **NOT** currently designed as:
- A generic SaaS or multi-tenant commercial subscription platform.
- A consumer-facing mobile application.
- A generic document-storage or CRM system.

All engineering efforts must focus on high-fidelity spatial monitoring, deterministic and statistical hazard calculation, live telemetry streaming, and clear operator situational awareness.

---

## 3. Frontend Specification

The web application provides an operator-grade situational dashboard built with modern web technologies:

- **Core Stack**: React 19, Vite, TypeScript, Tailwind CSS.
- **Mapping & GIS**: Leaflet and React Leaflet for interactive, tile-based geospatial visualization, zone boundary polygons, slope heatmaps, and sensor marker overlays.
- **Data Visualization**: Recharts for dynamic time-series charts (rainfall accumulation vs. threshold curves, soil saturation profiles, historical risk progression).
- **Icons & Polish**: Lucide React for consistent domain iconography.
- **Core Interface Views**:
  1. **Spatial Hazard Map**: Interactive geographic map displaying color-coded risk zones (Green: Low, Amber: Moderate, Orange: High, Red: Critical) with interactive popup summaries.
  2. **Live Risk Gauge & Telemetry Feed**: Real-time summary statistics for active monitored zones, average regional risk, and sensor health.
  3. **Zone Detail Inspector**: Deep-dive spatial panel displaying elevation profile, slope gradient, soil type, 24h/72h rainfall, and soil moisture index.
  4. **Explainability & Factor Drivers**: Dynamic visual breakdown of primary contributors driving elevated risk scores (e.g., rainfall saturation, slope angle).
  5. **Live Alert Console**: Chronological alert feed with severity filters, acknowledgment controls, and recommended intervention protocols.
  6. **Scenario Simulator Controls**: Interactive panel to inject synthetic environmental events (e.g., flash cloudburst, steady monsoon soaking) and observe system reactions in real time.

---

## 4. Backend Specification

The backend serves as the central orchestration engine handling data ingestion, risk evaluation, storage, and real-time synchronization:

- **Core Stack**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy (Async).
- **RESTful Endpoints**:
  - `GET /api/v1/zones`: Retrieve monitored spatial zones, boundaries, and current risk status.
  - `GET /api/v1/zones/{zone_id}`: Detailed telemetry and historical readings for a specific zone.
  - `GET /api/v1/readings`: Query historical environmental sensor observations.
  - `POST /api/v1/readings`: Ingest new sensor readings (from IoT telemetry or simulator).
  - `GET /api/v1/alerts`: Query active and historical hazard alerts with filtering.
  - `POST /api/v1/alerts/{alert_id}/ack`: Acknowledge an active hazard alert.
  - `GET /api/v1/model/metadata`: Retrieve active risk model version, parameters, and feature weights.
- **WebSocket Gateway**:
  - `/ws/live`: Real-time duplex channel streaming live telemetry and zone risk updates.
  - `/ws/alerts`: Instant notification channel for newly triggered early warning alerts.
- **Validation & Pipeline Engine**:
  - Pydantic models enforcing strict schema validation on all incoming telemetry.
  - Asynchronous background task execution for risk score recalculation and threshold checks.

---

## 5. Database Specification

The initial development and demonstration database is **SQLite**, accessed asynchronously via SQLAlchemy.

### Expected Conceptual Entities:
- `zones`: Spatial hazard sectors with geometric bounds, centroid coordinates, slope, elevation, aspect, and soil taxonomy.
- `sensor_readings`: Time-stamped telemetry (rainfall 24h/72h, soil moisture, pore pressure, temperature, humidity, source).
- `risk_scores`: Timestamped calculated hazard ratings ($0.0 - 1.0$), categorical severity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), confidence score, and contributing driver JSON.
- `alerts`: Generated hazard warning events, threshold trigger criteria, severity, timestamp, status (`ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`), and acknowledgment metadata.
- `historical_incidents`: Historical landslide event records for model training, validation, and benchmarking.
- `data_sources`: Registry of connected data providers (IMD, GSI, Simulator, IoT sensors) with status and sync timestamps.
- `model_metadata`: Registry of risk model configurations, heuristic formulas, trained ML model checkpoints, and feature importance.

*(Note: Final production schema and migrations will be implemented in subsequent phases).*

---

## 6. AI & Machine Learning Architecture

The analytical pipeline combines deterministic domain heuristics with statistical machine learning:

1. **Feature Engineering**:
   - Temporal features: 24-hour rainfall intensity, 48-hour cumulative rainfall, 72-hour Antecedent Rainfall Index ($ARI$), rate of soil moisture increase.
   - Spatial/Topographic features: Slope gradient (degrees), elevation, aspect, curvature, Topographic Wetness Index ($TWI$).
   - Geological features: Soil texture, cohesion, internal friction angle, underlying lithology.
2. **Explainable Risk Scoring**:
   - Baseline heuristic model incorporating hydro-geological thresholds (e.g., Caine rainfall-intensity-duration threshold curves).
   - Clear decomposition of total risk into explicit driver percentages (e.g., 60% rainfall saturation, 30% steep slope, 10% soil weakness).
3. **Machine Learning Model (Optional / Complementary)**:
   - Supervised classification/regression (Random Forest / XGBoost) trained on historical landslide inventories.
   - Outputs probabilistic landslide susceptibility index ($0.0 - 1.0$) alongside SHAP-compatible feature contributions.
4. **LLM / Gemini Integration Boundary**:
   - **Constraint**: Gemini **MUST NOT** be used to calculate numerical risk scores or make safety-critical threshold evaluations.
   - **Allowed Scope**: Gemini is used strictly for natural-language alert synthesis, multi-lingual public emergency advisories, operator situation reports, and intelligent query assistance over historical sensor logs.

---

## 7. Environmental Scenario Simulator

To enable rigorous end-to-end testing and impactful demonstrations without requiring live sensor deployments:

- **Synthetic Stream Engine**: Generates continuous time-series observations for all registered zones.
- **Scenario Profiles**:
  - *Normal Dry Season*: Stable low moisture, minimal precipitation, baseline green hazard status.
  - *Moderate Monsoon Showers*: Gradual rainfall accumulation, progressive soil saturation, amber alerts.
  - *Extreme Cloudburst Event*: High-intensity short-duration downpour triggering rapid threshold exceedance and critical red alerts.
  - *Post-Storm Drainage & Recovery*: Gradual risk decay as drainage and evaporation occur.
- **Provenance Transparency**: Every simulated reading is tagged with `source: "simulator"` to ensure absolute transparency.

---

## 8. Data Sources & Ingestion Strategy

The platform architecture is designed to ingest and harmonize the following authoritative data categories:

1. **Historical Landslide Inventories**: Geological Survey of India (GSI) Bhukosh portal, ISRO Bhuvan landslide database, NASA Global Landslide Catalog.
2. **Meteorological Data**: India Meteorological Department (IMD) gridded rainfall data, automatic weather stations (AWS), Open-Meteo API.
3. **Topography & Elevation**: Digital Elevation Models (DEM) from SRTM 30m / Copernicus DEM 30m / Cartosat.
4. **Soil & Geological Data**: National Bureau of Soil Survey and Land Use Planning (NBSS&LUP) soil maps, GSI lithology layers.
5. **Land Use & Land Cover (LULC)**: ESA WorldCover / ISRO Bhuvan land cover datasets.

*(Specific dataset choices and download scripts will be established following detailed data-source research).*

---

## 9. Realtime Synchronization Architecture

```text
[Simulator / Telemetry Ingestion]
                │
                ▼
      [FastAPI Ingest Route]
                │
                ▼
      [Risk Engine Evaluation]
        ├── Heuristic Score
        └── ML Susceptibility
                │
                ▼
    [SQLite Atomic Persistence]
        ├── Write Sensor Reading
        ├── Write Risk Score
        └── Write Alert (if threshold breached)
                │
                ▼
     [WebSocket Broadcast Hub]
                │
                ▼
     [React Frontend Dashboard]
        ├── Re-render Map Hazard Polygon
        ├── Update Live Telemetry Cards
        ├── Append to Alert Timeline
        └── Refresh Time-Series Charts
```

The cycle operates with sub-second latency from telemetry arrival to UI dashboard reflection.

---

## 10. Security & Configuration Strategy

- **Environment Separation**: Local development, testing, staging, and production environments are strictly isolated via configuration files.
- **No Hardcoded Credentials**: API tokens, database paths, and external keys are loaded exclusively through environment variables using Pydantic Settings.
- **Ignored by Git**: `.env` and `.env.*` are strictly excluded in `.gitignore`.
- **Sanitized Template**: `.env.example` provides explicit variable definitions with non-functional placeholders.
- **Input Validation**: All REST and WebSocket payloads undergo Pydantic validation to guard against injection and malformed inputs.

---

## 11. Engineering Principles & Quality Standards

1. **Modularity**: Every module (`apps/api`, `apps/web`, `ml/`, `simulator/`, `data/`) has isolated responsibilities with explicit contracts.
2. **Type Safety**: Full TypeScript strict mode on the frontend; Python type hints (`mypy` compliant) on the backend and ML pipelines.
3. **Minimal Dependencies**: Rely on standard, well-maintained libraries rather than heavy, monolithic frameworks.
4. **Reproducibility**: Preprocessing, model training, and simulation scripts are deterministic and runnable via single commands.
5. **Clear Naming**: Consistent naming conventions across database columns, API DTOs, and frontend components.
6. **Documentation First**: Architectural decisions, data contracts, and environment requirements are maintained in sync with code.
7. **Git Discipline**: Conventional commits, protected `main` branch, and preserved historical archive branches.
