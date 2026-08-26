# System Architecture

## AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

This document specifies the end-to-end system architecture, component responsibilities, data flow, and technology boundaries for the Landslide Early Warning and Risk Monitoring platform.

---

## 1. High-Level Architecture Diagram

```text
                  ┌──────────────────────────────────────┐
                  │            External Data             │
                  │                                      │
                  │  GSI / IMD / DEM / Soil / Weather    │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │    Data Processing & Features        │
                  │                                      │
                  │  Temporal aggregation, slope calc,   │
                  │  soil saturation & rainfall index    │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │          Risk Engine / ML            │
                  │                                      │
                  │  Explainable heuristic risk score    │
                  │  + optional ML classifier/regressor  │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │           FastAPI Backend            │
                  │                                      │
                  │  REST API + WebSocket Broadcast     │
                  │  Alert Engine + Session Management   │
                  └──────────────────┬───────────────────┘
                                     │
                ┌────────────────────┴────────────────────┐
                ▼                                         ▼
       ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
       │         React Dashboard         │       │         SQLite Database         │
       │                                 │       │                                 │
       │  - Interactive Hazard Map       │       │  - Zones & Geometries           │
       │  - Realtime Risk Gauge          │       │  - Sensor & Weather Readings    │
       │  - Alert Feed & Timeline        │       │  - Risk Calculation History     │
       │  - Trend & Rainfall Analytics   │       │  - Generated Alerts             │
       │  - Explainability / Insights    │       │  - Model Metadata               │
       └─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 2. Component Responsibilities & Boundaries

### 2.1. Frontend (`apps/web`)
- **Technology**: React 19, Vite, TypeScript, Tailwind CSS, Leaflet / React Leaflet, Recharts, Lucide React.
- **Responsibilities**:
  - Render high-resolution interactive GIS map of monitored landslide zones with color-coded risk overlays (Low, Moderate, High, Critical).
  - Display live telemetry and environmental metrics (cumulative rainfall, soil moisture, slope angle, geological stability).
  - Maintain active WebSocket connection to the backend for zero-latency alert reception and live metric updates.
  - Present multi-factor risk explainability panels breaking down risk contributors (e.g., 72h antecedent rainfall, slope steepness, soil pore pressure).
  - Provide historical analytics charts (time-series precipitation trends vs. hazard threshold lines).
  - Deliver responsive operator-grade UI for disaster management response teams and regional authorities.

### 2.2. Backend (`apps/api`)
- **Technology**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy (Async), Pydantic v2.
- **Responsibilities**:
  - Expose RESTful endpoints for zone queries, historical readings, alert management, and model metadata.
  - Expose WebSocket endpoints (`/ws/live`, `/ws/alerts`) to broadcast streaming sensor updates and state transitions to connected clients.
  - Execute data validation and schema sanitization across all ingestion payloads.
  - Trigger risk evaluation pipeline upon receiving new sensor readings or scheduled polling.
  - Manage the alert dispatch lifecycle (threshold crossing, alert generation, escalation, acknowledgment).

### 2.3. Database (SQLite)
- **Technology**: SQLite (via SQLAlchemy async / aiosqlite).
- **Responsibilities**:
  - Persist spatial zone definitions, coordinates, bounding polygons, slope, and soil characteristics.
  - Store time-series sensor observations (rainfall 24h/72h, soil moisture, temperature, humidity).
  - Maintain historical log of calculated risk scores, confidence levels, and contributing factor drivers.
  - Record active and acknowledged alert events with timestamps and trigger reasons.
  - Store model versioning and dataset catalog metadata.
  - Provide a lightweight, zero-configuration local database that facilitates rapid testing and standalone demonstration.

### 2.4. Risk Engine & Machine Learning (`ml/`)
- **Technology**: Python, NumPy, Pandas, Scikit-learn, XGBoost.
- **Responsibilities**:
  - Compute deterministic, explainable baseline hazard scores using hydro-geological domain formulas (e.g., Antecedent Rainfall Index, slope instability criteria).
  - Provide optional machine learning classification/regression models (Random Forest / Gradient Boosted Trees) trained on historical landslide inventories.
  - Produce factor importance and driver breakdowns explaining why a specific zone crossed alert thresholds.
  - Ensure clear decoupling between deterministic physics/heuristic rules and statistical ML inference.

### 2.5. Environmental Simulator (`simulator/`)
- **Technology**: Python async event generator / CLI tool.
- **Responsibilities**:
  - Emulate real-time telemetry from remote IoT rain gauges, soil moisture probes, and pore-pressure sensors across defined hazard zones.
  - Generate customizable disaster scenarios (e.g., dry baseline, sudden monsoon downpour, prolonged saturation event leading to slope failure).
  - Clearly tag all generated data with `source: "simulator"` to maintain strict provenance distinction from real-world telemetry.

### 2.6. External Data Ingestion (`data/`)
- **Data Sources**: Geological Survey of India (GSI) hazard maps, India Meteorological Department (IMD) weather feeds, Digital Elevation Models (DEM / SRTM / Copernicus), ISRO / Bhuvan landslide inventories.
- **Responsibilities**:
  - Ingest, preprocess, and normalize spatial raster and vector datasets into consistent coordinate reference systems (CRS: EPSG:4326).
  - Standardize raw meteorological and topographic features for ingestion into the database and risk engine.

### 2.7. AI / Gemini Integration Boundary
- **Role**: Operator Assistance, Natural-Language Synthesis, and Decision-Support Summarization.
- **Strict Boundary**:
  - Gemini **MUST NOT** be used to calculate the primary numerical risk score or trigger deterministic life-safety thresholds.
  - Gemini **MAY** be utilized to generate natural-language incident summaries for disaster management operators, draft public warning bulletins, translate evacuation advice into regional languages, and provide conversational queries over historical sensor trends.

---

## 3. End-to-End Data Pipeline Flow

```text
[Simulator / Weather Feeds]
            │ (Raw Readings)
            ▼
[Data Ingestion & Feature Engineering]
            │ (Normalized Features)
            ▼
[Deterministic Risk Engine + ML Model]
            │ (Risk Score + Factor Breakdown)
            ▼
[FastAPI Backend Engine]
     ├──> [SQLite: Persist Reading, Score & Alert]
     └──> [WebSocket Broadcast to React Dashboard]
```

1. **Ingest**: Environmental measurements (rainfall, moisture, temperature) arrive via external API connectors or the scenario simulator.
2. **Process**: Time-series aggregations (24h, 48h, 72h antecedent rainfall) and spatial slope associations are computed.
3. **Evaluate**: The Risk Engine calculates the continuous risk score ($0.0 - 1.0$), determines the hazard category (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), and extracts driver weights.
4. **Persist**: The reading, computed risk metrics, and any generated alerts are recorded in SQLite.
5. **Broadcast**: FastAPI broadcasts the new state over WebSocket channels to all connected React clients in real time.
6. **Assist**: When requested by an operator, the advisory AI layer synthesizes human-readable situation reports and actionable evacuation guidelines.
