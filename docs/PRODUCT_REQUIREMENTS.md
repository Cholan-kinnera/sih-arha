# Product Requirements Document (PRD)

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

> **Document Type**: Detailed Implementation-Ready Product Requirements Specification
> **Status**: Approved Baseline Specification
> **Authoritative Foundation**: [docs/PRODUCT_CONSTITUTION.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_CONSTITUTION.md)
> **Target Audience**: Frontend Engineers, Backend Engineers, ML Engineers, Data Engineers, UI/UX Designers, QA, and Hackathon Evaluators

---

## 1. Product Overview

### 1.1. Identification & Classification
- **Official Product Name**: AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas
- **Short Name / Working Title**: Landslide Early Warning System (LEWS)
- **Product Type**: Web-Based Geospatial Intelligence & Early Warning Operational Dashboard (Proof-of-Concept / Functional Prototype).
- **Target Users**: Disaster management monitoring teams, District Emergency Operation Centers (DEOC), field response personnel, infrastructure operators, and geotechnical researchers.
- **Primary Problem**: Landslide hazard signals (precipitation intensity, 72h antecedent rainfall, slope steepness, soil moisture saturation, historical incident planes) are fragmented across disparate systems and presented as raw data or opaque scores, depriving emergency operators of early, location-specific, and explainable risk intelligence.
- **Proposed Solution**: A centralized, map-centric operational platform that aggregates spatial and meteorological signals, evaluates multi-factor hydro-geological hazard scores, streams real-time simulated telemetry via WebSockets, and delivers explainable driver breakdowns and AI-assisted situation briefings.
- **Prototype Boundary**: This system is a high-fidelity operational demonstration prototype. It is **not** a certified statutory warning authority. All mathematical thresholds and model inferences serve as proof-of-concept models requiring field geotechnical calibration prior to life-safety deployment.

### 1.2. Product Definition in Brief

#### One-Sentence Definition
> An intelligent geospatial monitoring and early-warning platform that transforms fragmented terrain, rainfall, soil, and historical landslide data into location-specific, explainable risk intelligence and real-time alerts for disaster management operators.

#### One-Paragraph Definition
> The AI-Based Early Warning & Risk Monitoring platform is an operational situational dashboard engineered to safeguard vulnerable mountain communities. By ingesting Digital Elevation Models (DEM), multi-temporal precipitation accumulations (24h/72h), volumetric soil moisture, and historical landslide inventories, the platform calculates deterministic and machine-learning hazard scores ($0.0 - 1.0$) across distinct geographical zones. Integrated with a real-time WebSocket telemetry hub, dynamic scenario simulator, explainable factor breakdowns, and non-deterministic Google Gemini situation briefings, the platform enables emergency managers to visualize imminent hazards, understand physical risk drivers, and accelerate emergency response times.

---

## 2. User Personas

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               USER PERSONA MATRIX                                │
├──────────────────────────┬──────────────────────────┬────────────────────────────┤
│ 1. DISASTER OPS OFFICER  │ 2. FIELD RESPONSE LEAD   │ 3. TECHNICAL / RESEARCHER  │
│ High-level district view │ Tactical zone monitoring │ Deep model & data analysis │
│ Fast triage & alert ack  │ Rapid field verification │ Provenance, SHAP & curves  │
└──────────────────────────┴──────────────────────────┴────────────────────────────┘
```

### 2.1. Persona 1: Disaster Management Operator (Primary Persona)
- **Name / Archetype**: District Emergency Operations Center (DEOC) Duty Officer
- **Role & Context**: Monitors district-wide hazard status during active monsoon seasons; coordinates between state authorities and local field units.
- **Goals**:
  - Instantly identify which monitored mountain sectors are crossing safety thresholds.
  - Understand the specific physical trigger (e.g., rainfall spike vs. saturated slope) within 15 seconds.
  - Acknowledge alerts and relay actionable advisories to field emergency units.
- **Key Decisions**: Triggering pre-emptive road closures, staging disaster response teams, issuing evacuation advisories.
- **Information Needed**: Real-time hazard severity badges, map color codes, 24h/72h rainfall totals, active alert queue, AI-generated situation summary.
- **Pain Points**: Information overload from raw sensor tables, opaque "high risk" flags without rationale, delayed warning dissemination.

### 2.2. Persona 2: Emergency & Field Monitoring Team Lead
- **Name / Archetype**: Mountain Sector Field Inspector / Quick Response Team
- **Role & Context**: Deployed on the ground in high-risk taluks/blocks; inspects physical culverts, retaining walls, and slope cracks.
- **Goals**:
  - Inspect zone-specific telemetry (soil moisture trends, rainfall rate of rise) before entering high-risk sectors.
  - Receive instantaneous alert broadcasts on tactical tablet or laptop displays.
  - Cross-reference current rainfall against historical landslide locations in their sector.
- **Key Decisions**: Safe routing for response personnel, identifying localized slope failure precursors.
- **Information Needed**: Micro-catchment slope gradient, recent rainfall trends, live soil saturation percentages, proximity to previous debris flows.
- **Pain Points**: Inability to see telemetry trends over time, lack of offline/stale data indicators when field connectivity fluctuates.

### 2.3. Persona 3: Geotechnical Researcher & Technical Evaluator
- **Name / Archetype**: Landslide Hazard Modeler / Hackathon Evaluator
- **Role & Context**: Evaluates the mathematical validity, data lineage, and machine learning architectures of the early warning system.
- **Goals**:
  - Inspect the analytical formulas, feature weights, and ML model performance metrics (ROC-AUC, confusion matrix).
  - Verify data provenance, coordinate reference systems, and dataset limitations.
  - Test scenario simulations under extreme synthetic cloudburst conditions to assess system stability.
- **Key Decisions**: Validating model calibration, evaluating algorithm reproducibility, certifying feature importance.
- **Information Needed**: Feature contribution breakdowns, model metadata (version, training data, algorithm), raw sensor tables, dataset catalog.
- **Pain Points**: Black-box AI systems that cannot explain their calculations; systems that disguise simulated data as live observations.

---

## 3. Implementation-Oriented User Stories

| ID | Module | User Story Statement | Acceptance Goal |
| :--- | :--- | :--- | :--- |
| **US-01** | **Overview** | *As an operator*, I want to view a high-level summary of all monitored zones and active alerts on a single screen so that I can immediately assess the district hazard posture. | Summary metrics, alert banner, and top-risk zones render within 1 second of launch. |
| **US-02** | **Risk Map** | *As an operator*, I want to visualize risk geographically via color-coded polygons so that I can pinpoint spatial clusters of elevated vulnerability. | Map renders interactive polygon overlays with distinct severity colors and hover tooltips. |
| **US-03** | **Risk Map** | *As an operator*, I want to click any zone on the map so that I can immediately view its detailed telemetry and risk breakdown in a slide-over drawer. | Zone selection opens the Zone Intelligence inspector without reloading the page. |
| **US-04** | **Zone Intel** | *As an operator*, I want to see the exact factor driver breakdown (e.g., rainfall, slope, soil) for a zone so that I can explain the risk score to authorities. | Visual driver bar/radar shows exact percentage contributions summing to 100%. |
| **US-05** | **Alerts** | *As an operator*, I want to receive immediate visual notifications when a zone breaches threshold levels so that I can prioritize emergency response. | Active alert appears in the real-time alert feed with sound/visual cue and trigger reason. |
| **US-06** | **Alerts** | *As an operator*, I want to acknowledge active alerts with a timestamped record so that my team maintains an auditable incident log. | Clicking "Acknowledge" updates alert state to `ACKNOWLEDGED` and logs operator action. |
| **US-07** | **Analytics** | *As an operator*, I want to compare time-series rainfall against empirical threshold curves so that I can anticipate slope failure before it occurs. | Recharts graph plots 72h cumulative precipitation against Caine intensity-duration lines. |
| **US-08** | **Model Intel** | *As a researcher*, I want to inspect model parameters, algorithms, and feature rankings so that I can evaluate scoring transparency. | Dedicated page displays model metadata, active algorithm (Heuristic/XGBoost), and feature weights. |
| **US-09** | **Data Sources**| *As an evaluator*, I want to view the provenance and sync status of every dataset so that I can verify data lineage. | Data source registry lists provider names, coordinate frames, update times, and limitations. |
| **US-10** | **Simulator** | *As an evaluator*, I want to trigger a synthetic cloudburst scenario so that I can watch the end-to-end alert pipeline react in real time. | Simulator control panel enables injecting preset weather events; telemetry streams via WebSockets. |
| **US-11** | **AI Advisor** | *As an operator*, I want to generate a natural-language situation briefing so that I can quickly brief field commanders. | Gemini generates a crisp 3-bullet summary grounded strictly in verified telemetry. |

---

## 4. Functional Requirements: Overview Dashboard

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             OVERVIEW DASHBOARD LAYOUT                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ SYSTEM STATUS BAR: WebSocket Connected | Simulator Mode | Data Fresh: 2s ago ] │
├──────────────────────┬──────────────────────┬────────────────────────────────────┤
│ METRIC CARD 1        │ METRIC CARD 2        │ METRIC CARD 3    │ METRIC CARD 4   │
│ Monitored Zones: 12  │ Avg Risk Score: 0.42 │ Critical Alerts: 2 │ 24h Peak Rain: 184mm│
├──────────────────────┴──────────────────────┴──────────────────┬─────────────────┤
│ MAIN CONTENT LEFT (65% width)                                  │ RIGHT (35% width)│
│ ┌────────────────────────────────────────────────────────────┐ │ ┌─────────────┐ │
│ │ MINI RISK MAP PREVIEW (Interactive GIS Canvas)             │ │ │ RECENT      │ │
│ │ Click zone to inspect                                      │ │ │ ALERTS FEED │ │
│ └────────────────────────────────────────────────────────────┘ │ └─────────────┘ │
│ ┌────────────────────────────────────────────────────────────┐ │ ┌─────────────┐ │
│ │ DISTRICT 72H RISK TRAJECTORY (Time-Series Sparkline)        │ │ │ TOP AT-RISK │ │
│ └────────────────────────────────────────────────────────────┘ │ │ ZONES LIST  │ │
└────────────────────────────────────────────────────────────────┴─┴─────────────┴─┘
```

### 4.1. Detailed Dashboard Components
1. **System Status Bar**:
   - Displays real-time WebSocket connection state (`CONNECTED`, `RECONNECTING`, `OFFLINE`).
   - Displays active simulation badge (`SIMULATOR ACTIVE: Scenario #3 Cloudburst`).
   - Displays global data freshness indicator (`Last telemetry update: 4s ago`).
2. **Key Metric Cards (StatCards)**:
   - *Total Monitored Sectors*: Integer count with trend delta.
   - *Regional Average Risk*: Continuous index ($0.0 - 1.0$) with color-coded status badge.
   - *Active Critical Alerts*: High-visibility badge displaying unresolved emergency alerts.
   - *Max 24h Rainfall*: Peak precipitation measured across all zones in millimeters.
3. **Mini Risk Map Preview**:
   - Embedded interactive leaflet viewport centered on the monitored district.
   - Clickable zone centroids and bounding polygons.
4. **Top At-Risk Zones Table**:
   - Ranked list of zones sorted by current risk score in descending order.
   - Displays Zone Name, Current Score, Severity Badge, Primary Trigger Factor, and Quick Inspect CTA.
5. **Recent Alert Ticker**:
   - Live scrollable stream of the last 5 generated alerts with timestamps and severity indicators.

### 4.2. State Specifications
- **Loading State**: Skeleton loaders for all 4 StatCards and animated shimmer box for map/tables.
- **Empty State**: Friendly informational banner: *"No monitored zones configured. Ingest geospatial catchment data to begin."*
- **Error State**: Non-blocking alert banner: *"Unable to connect to telemetry backend. Retrying in 5s..."* with manual "Retry Connection" button.
- **Stale State**: Amber pulse on status bar if no telemetry packet received for $>60\text{ seconds}$.

---

## 5. Functional Requirements: Interactive Risk Map

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 RISK MAP CANVAS                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ Layer Controls: [x] Hazard Zones  [x] Rain Heatmap  [ ] Historical Landslides] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│      (Zone A - Green: Low)              (Zone B - Crimson: Critical)             │
│            [ 0.18 ]                                  [ 0.86 ]                    │
│                                                                                  │
│                                (Zone C - Amber: Moderate)                        │
│                                         [ 0.48 ]                                 │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ MAP LEGEND:  ● Low (<0.30)  ● Moderate (0.30-0.59)  ● High (0.60-0.79)  ● Critical (≥0.80) ] │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 5.1. Geospatial Map Capabilities
- **Map Base**: OpenStreetMap / CartoDB Dark Matter tile provider via Leaflet.
- **Zone Polygon Rendering**: GeoJSON polygon layers representing natural watershed catchments or administrative slope blocks.
- **Dynamic Color Encoding**:
  - `Score 0.00 - 0.29`: Green (`#10b981`, fill opacity 0.35, border 2px)
  - `Score 0.30 - 0.59`: Amber (`#f59e0b`, fill opacity 0.45, border 2px)
  - `Score 0.60 - 0.79`: Orange (`#f97316`, fill opacity 0.55, border 2px)
  - `Score 0.80 - 1.00`: Red (`#ef4444`, fill opacity 0.65, border 3px pulsating)
- **Interactive Layer Toggles**:
  1. *Hazard Zones Layer (Default: On)*: Monitored polygon boundaries.
  2. *Rainfall Heatmap Overlay (Default: On)*: Interpolated precipitation surface.
  3. *Historical Landslides Layer (Default: Off)*: Cluster markers showing historical rupture locations.
  4. *Sensor Station Markers (Default: Off)*: Physical IoT rain gauge and piezometer positions.
- **Zone Click Behavior**:
  - Centers and smoothly pans map to the clicked zone polygon.
  - Highlights polygon boundary with glowing white hairline stroke.
  - Automatically opens the **Zone Intelligence slide-over drawer** on the right side of the screen.

### 5.2. Core Questions Answered on Map
- **WHERE**: Spatial coordinates and geographic contours of vulnerable slopes.
- **HOW MUCH**: Color-coded severity and embedded numerical score badge.
- **WHAT CHANGED**: Animated radar rings pulse on zones that experienced a severity transition in the last 15 minutes.

---

## 6. Functional Requirements: Zone Intelligence Drawer / Page

The Zone Intelligence component provides the definitive deep-dive analysis for any selected hazard sector.

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         ZONE INTELLIGENCE SLIDE-OVER DRAWER                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ HEADER: Meppadi Catchment North (ID: zone-wayanad-01)          [ Close (X) ]    │
│ STATUS: [ CRITICAL HAZARD - 0.84 ] | Confidence: 91% | Updated: 12s ago          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: FACTOR CONTRIBUTION BREAKDOWN (Explainability Engine)                │
│ • 72h Antecedent Rainfall (310mm):  ████████████████████ 45% (Critical Trigger) │
│ • Terrain Slope Gradient (34.5°):   ████████████ 30% (High Predisposition)      │
│ • Soil Moisture Saturation (86%):   ██████ 15% (Elevated Pore Pressure)         │
│ • Lithology & Historical Density:   ████ 10% (Past Scars Nearby)                │
├──────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: METEOROLOGICAL & GEOTECHNICAL TELEMETRY                               │
│ [ 24h Rain: 142.6mm ] [ 72h Rain: 310.2mm ] [ Soil Moisture: 86.4% ] [ Slope: 34.5° ]│
├──────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: 72-HOUR PRECIPITATION VS. STABILITY THRESHOLD (Recharts Line Graph)   │
│ [ Line: Observed Cumulative Rain vs. Red Dashed Line: Empirical Failure Curve ]  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: AI SITUATION BRIEFING (Google Gemini - Structured Evidence Only)      │
│ 🤖 "Zone 01 exhibits critical failure risk driven by intense 72h precipitation   │
│     exceeding regional empirical thresholds on a steep 34.5° lateritic slope.     │
│     Evacuation of downslope settlements along Route 4 is strongly advised."      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: ACTIONS & HISTORICAL RECORDS                                          │
│ [ Button: Acknowledge Zone Alert ] [ Button: Export Situation PDF ]              │
│ Historical Incidents in Catchment: 2 recorded events (2019 Debris Flow, 2024 Scar)│
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Section Specifications
1. **Identity & Hero Status**: Zone name, parent district/state, geographic centroid coordinates, active risk score gauge, severity badge, and data freshness tag.
2. **Explainability Driver Breakdown**: Horizontal stacked progress bars or radar chart illustrating the proportional contribution of each parameter to the final hazard score.
3. **Telemetry Matrix**: 4-card metric grid displaying 24h rain, 72h rain, soil moisture percentage, slope angle, and elevation.
4. **Time-Series Stability Chart**: Interactive Recharts graph plotting observed cumulative precipitation against the empirical threshold failure line.
5. **AI Situation Briefing**: Gemini-generated advisory card with explicit disclaimer badge: `[ AI Advisory - Grounded in Sensor Telemetry ]`.
6. **Historical Incident List**: Expandable accordion detailing past landslide events within a 2km radius (year, casualties, volume, trigger rainfall).

### 6.2. State Specifications
- **Loading State**: Skeleton cards for telemetry and loading spinner on AI summary card.
- **AI Unavailable State**: Graceful fallback banner: *"AI Advisory currently offline. Reviewing heuristic factor breakdown above."*
- **Empty State**: *"Select a zone on the Risk Map or Zones directory to inspect telemetry."*

---

## 7. Functional Requirements: Alert Engine & Operations

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 ALERT LIFECYCLE                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ Sensor Ingestion / Simulator ]                                                 │
│                │                                                                 │
│                ▼                                                                 │
│ [ Risk Calculation Engine ] ──> Threshold Check (Score ≥ 0.60)                   │
│                │                                                                 │
│                ▼                                                                 │
│ [ Alert Generated: Status = ACTIVE ] ──> WebSocket Broadcast to Dashboard        │
│                │                                                                 │
│                ▼                                                                 │
│ [ Operator Action: Click "Acknowledge" ] ──> Status = ACKNOWLEDGED               │
│                │                             (Timestamp + Operator ID Logged)    │
│                ▼                                                                 │
│ [ Risk Decays below Threshold (Score < 0.50) ] ──> Status = RESOLVED             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 7.1. Alert Severity & Threshold Tiers
- **LOW (`0.00 - 0.29`)**: Normal environmental conditions. No alert generated. Green status indicator.
- **MODERATE (`0.30 - 0.59`)**: Heightened meteorological activity. Advisory notification in system log. Amber status indicator.
- **HIGH (`0.60 - 0.79`)**: Approaching slope failure threshold. Formal **HIGH WARNING** alert dispatched. Orange banner with sound chime.
- **CRITICAL (`0.80 - 1.00`)**: Imminent failure hazard. **CRITICAL EMERGENCY** alert dispatched. Red flashing banner, persistent notification drawer item, and recommended immediate evacuation action.

### 7.2. Alert Management Features
- **Real-Time Alert Feed**: Chronological list of all generated alerts.
- **Filter Controls**: Multi-select filter by Severity (`MODERATE`, `HIGH`, `CRITICAL`), Status (`ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`), and Zone.
- **Operator Acknowledgment**:
  - "Acknowledge Alert" CTA button.
  - Prompts for optional operator note (e.g., *"Notified Wayanad Taluk Disaster Control Room"*).
  - Updates alert status in SQLite database and broadcasts updated state to all connected clients.
- **Alert History & Audit Log**: Immutable record of all alert timestamps, trigger reasons, risk scores at dispatch, and acknowledgment audit trails.

---

## 8. Functional Requirements: Analytics Module

The Analytics view provides deep-dive longitudinal insights to understand trends, patterns, and historical correlations.

### 8.1. Essential (Non-Decorative) Analytical Charts
1. **Precipitation vs. Empirical Threshold Curve (Caine Model)**:
   - *X-Axis*: Rainfall Duration (Hours: 1h to 72h).
   - *Y-Axis*: Rainfall Intensity ($mm/hr$).
   - *Plots*: Empirical regional threshold curve ($I = \alpha \cdot D^{-\beta}$) vs. observed zone rainfall trajectory.
   - *Utility*: Directly informs operators whether current rainfall intensity has entered the catastrophic failure envelope.
2. **Multi-Zone Risk Comparison Bar Chart**:
   - Compares current risk scores across all monitored zones side-by-side.
   - Highlighted threshold lines for High ($0.60$) and Critical ($0.80$).
3. **Soil Moisture Saturation vs. Slope Correlation Scatter Plot**:
   - *X-Axis*: Slope Gradient (Degrees).
   - *Y-Axis*: Volumetric Soil Moisture (%).
   - *Points*: Monitored zones color-coded by current risk score.
   - *Utility*: Visualizes clusters of steep, saturated slopes that represent prime failure candidates.
4. **Historical Landslide Recurrence Timeline**:
   - Bar / scatter chart showing historical landslide events plotted against peak monsoon months over the past decade.

---

## 9. Functional Requirements: Model Intelligence Module

To enforce transparency and eliminate black-box distrust, the Model Intelligence view exposes the inner workings of the scoring engine.

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               MODEL INTELLIGENCE                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE MODEL: Heuristic Hydro-Geological Scoring Engine v1.2                     │
│ STATUS: Operational Demonstration Baseline | Evaluation Metric: Deterministic    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ FEATURE WEIGHT CONFIGURATION:                                                    │
│ 1. 72h Antecedent Rainfall Index (ARI)   | Weight: 0.35 | Dynamic Meteorological │
│ 2. Slope Gradient (Degrees)              | Weight: 0.25 | Static Topographical   │
│ 3. Volumetric Soil Moisture (%)          | Weight: 0.20 | Dynamic Geotechnical   │
│ 4. 24h Rainfall Intensity (mm)           | Weight: 0.10 | Dynamic Meteorological │
│ 5. Historical Landslide Density / Scars  | Weight: 0.10 | Static Spatial         │
├──────────────────────────────────────────────────────────────────────────────────┤
│ COMPLEMENTARY ML PIPELINE (Experimental):                                        │
│ • Algorithm: Random Forest Classifier (n_estimators=100, max_depth=8)            │
│ • Training Dataset: GSI Bhukosh Western Ghats Historical Inventory (2014-2024)   │
│ • Validation ROC-AUC: 0.88 | Precision: 0.84 | Recall: 0.89                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ⚠️ MODEL DISCLAIMER & LIMITATIONS:                                               │
│ Model weights are calibrated on empirical Western Ghats research literature.     │
│ In-situ geotechnical field validation is required prior to operational use.      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Functional Requirements: Data Sources Transparency

The Data Sources view maintains an open catalog of all external datasets and sensor integrations.

### 10.1. Data Source Catalog Schema
| Field | Description | Example Value |
| :--- | :--- | :--- |
| **Source Name** | Public entity or data provider | Geological Survey of India (GSI) |
| **Dataset Title** | Specific layer / catalog name | National Landslide Susceptibility Mapping (NLSM) |
| **Data Type** | Format / structure | Spatial Vector Polygons (GeoJSON / Shapefile) |
| **Spatial Coverage** | Geographic boundaries | Western Ghats & Himalayan Mountain Belts |
| **Coordinate System** | Standard reference frame | WGS 84 / EPSG:4326 |
| **Update Frequency** | Ingestion periodicity | Static Baseline (Annual Update) |
| **Connection Status** | Live health status | `CONNECTED` / `CACHED` / `MOCK_DEMO` |
| **Known Limitations**| Documented constraints | 1:50,000 scale resolution; localized micro-cracks omitted |

---

## 11. Functional Requirements: AI Explanation Layer (Gemini)

### 11.1. Operational Scope & Guardrails
- **Role**: Natural-language situation briefings, operator decision-support drafting, and emergency bulletin generation.
- **Strict Guardrail Rules**:
  1. **Zero Numerical Computation**: Gemini is strictly prohibited from calculating or modifying the numerical risk score.
  2. **Zero Factual Invention**: Gemini must never hallucinate rainfall amounts, soil moisture percentages, historical dates, or geographic locations.
  3. **Strict Structured Grounding**: Gemini is fed a strictly validated JSON payload containing only verified sensor observations and calculated driver weights.
  4. **Clear Visual Labeling**: All AI-generated outputs in the UI must feature an explicit `[ AI Advisory ]` indicator.

### 11.2. Example Input / Output Contract

#### Structured Prompt Input (Backend to Gemini)
```json
{
  "zone_name": "Meppadi Catchment North",
  "calculated_risk_score": 0.84,
  "severity_level": "CRITICAL",
  "evidence": {
    "rainfall_24h_mm": 142.6,
    "rainfall_72h_mm": 310.2,
    "soil_moisture_pct": 86.4,
    "slope_degrees": 34.5,
    "soil_type": "Lateritic Red Soil",
    "primary_drivers": [
      {"factor": "72h Cumulative Precipitation", "contribution_pct": 45},
      {"factor": "Slope Steepness", "contribution_pct": 30},
      {"factor": "Soil Saturation", "contribution_pct": 15}
    ]
  },
  "historical_context": "2 recorded landslide events within 1.5km (2019, 2024)"
}
```

#### Generated Output (Gemini Response)
> **Situation Summary**: Critical landslide risk detected in Meppadi Catchment North (Risk Index: 0.84). The primary trigger is extreme 72-hour antecedent rainfall (310.2 mm) acting on steep terrain (34.5° slope) with high soil moisture saturation (86.4%).
> **Key Hazard Driver**: 72-hour cumulative precipitation contributes 45% of total failure susceptibility.
> **Recommended Operator Action**: Alert local emergency response units, monitor downslope drainage culverts, and prepare precautionary evacuation notices for low-lying settlements in Sector 4.

---

## 12. Realtime Experience & Simulation Requirements

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           REALTIME TELEMETRY ENGINE                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TELEMETRY CADENCE: Streaming packet dispatched every 3–5 seconds                │
│ TRANSPORT PROTOCOL: Asynchronous WebSocket Gateway (`/ws/live`, `/ws/alerts`)   │
│ UI LATENCY GOAL: <100ms from WebSocket receipt to React DOM update               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PRESET SIMULATION SCENARIOS:                                                     │
│ 1. [ Normal Dry Season ]     -> Stable baseline (Scores 0.05 - 0.25, All Green)  │
│ 2. [ Steady Monsoon Showers] -> Gradual saturation (Scores 0.35 - 0.55, Amber)  │
│ 3. [ Flash Cloudburst Event] -> Rapid rain spike (Scores 0.80 - 0.95, Red Alert) │
│ 4. [ Post-Storm Drainage ]   -> Steady risk decay over simulated time            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PROVENANCE TRANSPARENCY: All simulated packets carry `source: "simulator"`       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 12.1. Connection Management & Resilience
- **Auto-Reconnect**: Exponential backoff reconnect strategy ($1s, 2s, 4s, 8s, \max 15s$) if WebSocket disconnects.
- **Connection Indicator**: Header badge displaying connection health:
  - 🟢 `LIVE (Connected)`
  - 🟡 `RECONNECTING (Attempt 2/5)`
  - 🔴 `OFFLINE (Cached Telemetry Displayed)`
- **Simulator Status Label**: Persistent amber pill badge on screen header when simulator mode is engaged.

---

## 13. Data Quality, Missing Data & Graceful Degradation

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      GRACEFUL DEGRADATION MATRIX                                 │
├────────────────────────────┬─────────────────────────────────────────────────────┤
│ SCENARIO                   │ SYSTEM RESPONSE & UI BEHAVIOR                       │
├────────────────────────────┼─────────────────────────────────────────────────────┤
│ 1. Missing Sensor Metric   │ Compute risk using available factors + baseline     │
│    (e.g., Soil Probe Dead) │ prior; flag score with lower confidence (e.g. 65%). │
├────────────────────────────┼─────────────────────────────────────────────────────┤
│ 2. Stale Telemetry         │ Display last known value with amber "Stale (12m ago"│
│    (No update > 10 mins)   │ badge; decay dynamic rainfall index gracefully.     │
├────────────────────────────┼─────────────────────────────────────────────────────┤
│ 3. External API Down       │ Serve cached static GIS layers; log non-blocking    │
│    (e.g., Weather feed)    │ warning in Data Sources console.                    │
├────────────────────────────┼─────────────────────────────────────────────────────┤
│ 4. Gemini AI Offline       │ Fall back to deterministic template briefings;      │
│    (API key invalid / down)│ display "AI Offline - Heuristic Summary Active".     │
├────────────────────────────┼─────────────────────────────────────────────────────┤
│ 5. Complete Backend Down   │ Display persistent offline modal; render cached     │
│                            │ static zone maps with local storage snapshot.       │
└────────────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 14. Navigation & Information Architecture

### 14.1. Top-Level Routes vs. Contextual Slide-Overs

```text
/ (App Root)
│
├── /overview ................. Top-Level Route (Executive Dashboard & Summary)
├── /map ...................... Top-Level Route (Full-Screen Geospatial GIS Canvas)
│     └── [Zone Drawer] ....... Contextual Slide-Over (Zone Intelligence & Telemetry)
├── /zones .................... Top-Level Route (Tabular / Grid Directory of All Zones)
│     └── /zones/:zone_id ..... Dedicated Full-Page View for Deep Linking
├── /alerts ................... Top-Level Route (Alert Operations Center & Audit Log)
├── /analytics ................ Top-Level Route (Precipitation vs. Threshold Curves)
├── /model-intelligence ....... Top-Level Route (Algorithm Weights & ML Susceptibility)
└── /data-sources ............. Top-Level Route (Data Lineage & Connection Health)
```

---

## 15. Responsive Layout Behavior

| Viewport Category | Screen Width | Layout Transformation & Adaptation |
| :--- | :--- | :--- |
| **Desktop (Primary Target)** | $\ge 1280px$ | Full multi-column dashboard; persistent left navigation sidebar; split-screen map and telemetry panels. |
| **Laptop / Compact Desktop** | $1024px - 1279px$ | Compact icon+label sidebar; 2-column StatCard grid; slide-over drawer for zone details. |
| **Tablet (Field Operations)** | $768px - 1023px$ | Collapsible hamburger sidebar; stacked single-column dashboard cards; full-screen modal for zone inspections. |
| **Mobile (Emergency View)** | $<768px$ | Simplified emergency view: prioritized alert banner, vertical zone risk cards, simplified static map overview. |

---

## 16. Comprehensive UI States Matrix

Every component across all modules must implement the complete set of operational UI states:

```text
┌─────────────────┬────────────────────────────────────────────────────────────────┐
│ UI STATE        │ VISUAL PRESENTATION & USER EXPERIENCE                          │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 1. Loading      │ Animated pulse skeletons matching exact component dimensions.  │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 2. Loaded       │ High-contrast, clean typography, crisp borders, live charts.   │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 3. Empty        │ Informative placeholder graphic with contextual call-to-action.│
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 4. Error        │ Inline warning banner with human-readable error & Retry button.│
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 5. Offline      │ Amber top bar; components display last cached data with status.│
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 6. Stale Data   │ Subtle amber clock icon with exact elapsed time since sync.    │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 7. AI Offline   │ Replaces AI briefing card with deterministic heuristic summary.│
├─────────────────┼────────────────────────────────────────────────────────────────┤
│ 8. Backend Down │ Non-intrusive bottom toaster: "Reconnecting to backend hub..." │
└─────────────────┴────────────────────────────────────────────────────────────────┘
```

---

## 17. Accessibility & Visual Contrast Standards

1. **WCAG AA Compliance**: High-contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings and icons) against dark slate backgrounds (`#0b0f17`, `#111827`).
2. **Color-Independent Severity Encoding**:
   - Risk is **never** communicated solely through color.
   - Every risk badge combines **Color + Text Label + Numerical Value + Icon** (e.g., Red + `"CRITICAL"` + `"0.84"` + Alert Triangle Icon).
3. **Keyboard Navigability**: Full keyboard navigation support (`Tab`, `Enter`, `Esc` to close drawers/modals) with visible high-contrast focus rings.
4. **Accessible Typography**: Legible sans-serif typography (`Inter`) for interface copy and monospaced font (`JetBrains Mono`) for sensor telemetry and geographic coordinates.

---

## 18. Non-Functional Requirements (Prototype Grade)

- **Performance**:
  - Initial frontend bundle size $<300\text{ KB}$ gzipped.
  - Cold page load time $<1.5\text{ seconds}$ on standard broadband.
  - WebSocket telemetry DOM re-render latency $<100\text{ ms}$.
  - REST endpoint response time $<50\text{ ms}$ for SQLite queries.
- **Maintainability & Modularity**:
  - Strict separation between presentation (`apps/web`), API orchestration (`apps/api`), simulation (`simulator/`), and analytical modeling (`ml/`).
- **Reproducibility**:
  - Entire application stack (FastAPI backend + React frontend + SQLite database) runnable locally via standard scripts without proprietary cloud infrastructure.
- **Security & Hygiene**:
  - Zero hardcoded secrets or API tokens in code.
  - Fully sanitized `.env.example` template.

---

## 19. MVP Priority Classification

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         MVP FEATURE PRIORITY HIERARCHY                           │
├──────────────────────────────────────────────────────────────────────────────────┤
│ P0 — ESSENTIAL FOR SIH DEMONSTRATION (Must be 100% complete and working)         │
│ • Overview Dashboard with real-time StatCards and Top At-Risk table              │
│ • Interactive Leaflet Risk Map with color-coded polygons and zone popups         │
│ • Zone Intelligence Drawer with explainability factor driver breakdown           │
│ • Multi-tier Alert System (High/Critical warnings) with Acknowledge workflow     │
│ • Deterministic Heuristic Risk Scoring Engine (Rainfall + Slope + Soil)          │
│ • Realtime Environmental Scenario Simulator (Normal / Monsoon / Cloudburst)      │
│ • WebSocket Telemetry Gateway for zero-latency UI updates                        │
│ • Grounded Google Gemini Situation Briefing (with strict fallback)               │
│ • Data Sources & Provenance Catalog                                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ P1 — STRONG ENHANCEMENTS (Implement after P0 core is rock solid)                 │
│ • Time-series Caine Threshold Chart (Intensity vs. Duration curve)               │
│ • Supervised ML Susceptibility Model (Random Forest / XGBoost comparison)        │
│ • Multi-lingual Emergency Advisory Generation (Hindi / Malayalam / Tamil)       │
│ • Export Situation Summary as downloadable PDF / Text report                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ P2 — FUTURE ROADMAP CAPABILITIES (Post-Hackathon Production Roadmap)             │
│ • InSAR Satellite Deformation Ingestion                                          │
│ • Numerical Weather Prediction (WRF) 24h Rainfall Forecast Ingestion             │
│ • Common Alerting Protocol (CAP) multi-agency broadcast integration              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 20. Concrete Acceptance Criteria (P0 Modules)

### 20.1. Module: Overview Dashboard
- **Given** the application is opened in a web browser:
  - **When** the page loads:
  - **Then** 4 StatCards render total zones, average risk, critical alerts, and max rainfall.
  - **And** the Top At-Risk table lists zones sorted from highest to lowest risk score.
  - **And** the mini map preview displays all zone centroids with correct severity colors.

### 20.2. Module: Interactive Risk Map
- **Given** monitored zones are loaded from the backend:
  - **When** the operator views the Risk Map:
  - **Then** all zone boundaries are rendered with semi-transparent fills matching their severity tier.
  - **When** the operator clicks on a red (Critical) zone polygon:
  - **Then** the map smoothly pans to the zone, highlights its perimeter, and opens the Zone Intelligence drawer.

### 20.3. Module: Zone Intelligence Drawer
- **Given** a zone is selected on the map or directory:
  - **When** the drawer opens:
  - **Then** it displays the continuous risk score ($0.0 - 1.0$) and categorical badge.
  - **And** it displays the factor contribution breakdown showing exact percentages for rainfall, slope, and soil.
  - **And** it displays current 24h rain, 72h rain, and soil moisture values.

### 20.4. Module: Alert Operations & Acknowledgment
- **Given** a zone's simulated telemetry causes its risk score to exceed $0.80$:
  - **When** the backend evaluates the new reading:
  - **Then** a `CRITICAL` alert is created in SQLite and broadcasted via WebSocket.
  - **And** an alert toast notification appears on the dashboard with an audible chime.
  - **When** the operator clicks "Acknowledge Alert":
  - **Then** the alert status changes to `ACKNOWLEDGED` and the acknowledgment timestamp is persisted.

### 20.5. Module: Realtime Simulation
- **Given** the simulator is set to "Flash Cloudburst" scenario:
  - **When** the simulation executes:
  - **Then** sensor telemetry packets stream to the frontend every 3 seconds.
  - **And** map zone colors dynamically transition from Green $\rightarrow$ Amber $\rightarrow$ Red as rainfall accumulates.
  - **And** every simulated data point displays the `source: "simulator"` provenance badge.

### 20.6. Module: AI Situation Briefing
- **Given** a high or critical risk zone with verified telemetry:
  - **When** the operator requests an AI briefing:
  - **Then** Gemini returns a concise 3-bullet situation report grounded strictly in the provided telemetry.
  - **And** the summary card displays an explicit `[ AI Advisory - Grounded in Telemetry ]` badge.

---

## 21. Product Prototype Success Metrics

The functional success of the prototype is measured against the following operational benchmarks:

```text
┌──────────────────────────────────────┬───────────────────────────────────────────┐
│ SUCCESS METRIC                       │ TARGET PROTOTYPE BENCHMARK                │
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ 1. Time to Comprehend Risk           │ $\le 15$ seconds for an operator to       │
│                                      │ identify the highest-risk district zone.  │
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ 2. Single-Screen Critical Context    │ $100\%$ of key hazard metrics visible     │
│                                      │ on Dashboard without horizontal scrolling.│
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ 3. Alert Broadcast Latency           │ $\le 100\text{ ms}$ from threshold breach │
│                                      │ to visual notification in React UI.       │
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ 4. Explainability Transparency       │ $100\%$ of risk scores provide an explicit│
│                                      │ factor driver percentage breakdown.       │
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ 5. Simulation Responsiveness         │ Immediate UI transition upon triggering a │
│                                      │ preset scenario (Cloudburst / Monsoon).   │
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ 6. Zero-Hallucination Adherence      │ $0$ ungrounded claims or invented numbers  │
│                                      │ produced by the Gemini advisory layer.    │
└──────────────────────────────────────┴───────────────────────────────────────────┘
```

---

## 22. Traceability Matrix: Product Constitution to Requirements

| Product Constitution Principle | Derived PRD Requirement | Governing Module | Verification Method |
| :--- | :--- | :--- | :--- |
| **1. Explainability Over Black-Box** | Every score must output explicit driver percentage weights. | `Zone Intelligence`, `Model Intel` | Unit tests verify driver weights sum to 100%; UI displays factor bars. |
| **2. Evidence Over AI Claims** | Gemini is strictly bounded to natural-language summaries of backend JSON. | `AI Explanation Layer` | Automated prompt grounding checks; numerical scores generated by Python engine only. |
| **3. Data Provenance** | Every reading, zone, and dataset must include source metadata. | `Data Sources`, `Zone Intel` | Database schema enforces `source` field; UI displays provenance badges. |
| **4. Realtime Situational Awareness** | Sub-second telemetry streaming and instantaneous alert dispatch. | `Realtime Gateway`, `Alerts` | WebSocket latency test verifies $<100\text{ ms}$ broadcast delivery. |
| **5. Human-in-the-Loop Support** | Decision support only; explicit operator alert acknowledgment. | `Alerts`, `Overview` | Alert acknowledgment action persists operator ID and timestamp. |
| **6. Graceful Degradation** | System functions with cached data if external APIs or AI are down. | `All Modules` | Integration test verifies UI remains functional when Gemini API key is missing. |
| **7. Honest Simulation** | Synthetic readings are always clearly marked as simulated. | `Simulator`, `Overview` | Header displays persistent `SIMULATOR ACTIVE` badge; data packets carry `source: "simulator"`. |
| **8. Prototype Transparency** | Disclaimers indicate prototype status requiring field calibration. | `Model Intel`, `Zone Intel` | Header and Model pages display clear demonstration prototype disclaimers. |

---

## 23. Recommended Sequential Implementation Sequence

```text
 1. Product Requirements (PRD) ─────── [ COMPLETED ]
 2. UX Specification & Wireframing ──── [ NEXT STEP ]
 3. UI Design System Tokens & Base
 4. Frontend Architecture & Routing Shell
 5. Overview Dashboard Implementation
 6. Interactive Risk Map Implementation
 7. Zone Intelligence Slide-Over Drawer
 8. Alert Operations Center & Acknowledgment
 9. Backend REST Schemas & Routers (FastAPI)
10. SQLite Database Models & Seeding Scripts
11. Data Ingestion & Feature Engineering Pipeline
12. Deterministic Hydro-Geological Risk Engine
13. Environmental Scenario Simulator (Python Async)
14. WebSocket Real-Time Gateway (`/ws/live`, `/ws/alerts`)
15. Machine Learning Susceptibility Pipeline (XGBoost/RF)
16. Google Gemini AI Situation Briefing Layer
17. Full End-to-End WebSocket + UI Integration
18. Comprehensive Automated Test Suite (Pytest + React)
19. SIH Demonstration Hardening & Scenario Scripting
20. Final Documentation Polish & Presentation Run-Through
```

### Rationale for Implementation Sequence
- **Frontend & UX First (Steps 1–8)**: Establishes the exact visual contracts, interaction paradigms, and state requirements before writing backend code. This ensures backend APIs and schemas are built precisely to satisfy verified UI requirements without redundant rework.
- **Backend & Database Foundation (Steps 9–10)**: Implements clean, async SQLite models and FastAPI routers matching the frontend contracts.
- **Physics-Informed Risk Engine & Simulator (Steps 11–14)**: Builds the core analytical brain and real-time streaming infrastructure to prove data flow.
- **ML & AI Layers (Steps 15–16)**: Layers advanced machine learning and Gemini advisory capabilities on top of a fully working deterministic core.
- **End-to-End Hardening (Steps 17–20)**: Connects all components, executes rigorous integration tests, and polishes demonstration presets for hackathon judging.
