# User Experience & Interaction Specification (UX Spec)

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

> **Document Type**: Master UX & Interaction Design Authority  
> **Status**: Approved Baseline Specification  
> **Hierarchical Authority**: [docs/PRODUCT_CONSTITUTION.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_CONSTITUTION.md) $\rightarrow$ [docs/PRODUCT_REQUIREMENTS.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_REQUIREMENTS.md) $\rightarrow$ `docs/UX_SPECIFICATION.md`  
> **Target Audience**: UI/UX Designers, Frontend Developers, Product Managers, QA Engineers, Hackathon Evaluators

---

## 1. Core UX Goal

The primary user experience goal is:

> **A disaster-management operator must be able to understand the district hazard posture within 5 seconds, identify the highest-risk sectors within 15 seconds, investigate physical driver causes within 30 seconds, and acknowledge or dispatch early warning alerts without losing geographic or situational context.**

The application is engineered as a **professional geospatial intelligence and disaster operations system**, not a generic marketing dashboard or consumer tracking app. Every interaction emphasizes spatial grounding, physical evidence over speculation, low-cognitive-load emergency triage, and seamless transitions between high-level situation awareness and micro-catchment sensor telemetry.

---

## 2. Information Architecture & Route Specifications

```text
/ (Root Application Shell)
│
├── /overview ................. Top-Level Route (Executive Situational Overview)
├── /map ...................... Top-Level Route (Interactive Full-Screen GIS Canvas)
│     └── [Zone Drawer] ....... Contextual Slide-Over (Zone Intelligence & Telemetry)
├── /zones .................... Top-Level Route (Tabular & Grid Directory of All Zones)
│     └── /zones/:zone_id ..... Dedicated Full-Page View for Direct Deep-Linking
├── /alerts ................... Top-Level Route (Alert Operations Center & Acknowledgment Log)
├── /analytics ................ Top-Level Route (Longitudinal Trends & Hydro-Physical Thresholds)
├── /model-intelligence ....... Top-Level Route (Scoring Formulas, ML Susceptibility & SHAP Weights)
└── /data-sources ............. Top-Level Route (Data Lineage, Provenance & Ingestion Status)
```

### Route Details Table
| Route | Page Title | Primary User | Key Information Displayed | Primary Action | Secondary Actions | Navigation Relationship |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/overview` | Overview | DEOC Duty Officer | System health, 4 StatCards, Mini Map preview, Top At-Risk table, Alert ticker | Quick-scan district posture | Click zone to open drawer; click alert to triage | Top-Level Root Default |
| `/map` | Risk Map | Monitoring Lead / Operator | Full-screen GIS map, GeoJSON hazard polygons, rainfall heatmap, sensor pins | Spatial pattern analysis & zone selection | Layer toggles, zoom/fit bounds, severity filter | Top-Level Main Canvas |
| `/zones` | Zone Directory | Field Unit Lead / Analyst | Filterable grid/table of all monitored sectors, slopes, soil types, scores | Sort and compare zones | Filter by severity; click to inspect | Top-Level List View |
| `/alerts` | Alert Console | Emergency Operator | Chronological warning stream, severity badges, trigger metrics, audit logs | Acknowledge active alerts | Filter by status (`ACTIVE`/`ACK`); export audit CSV | Top-Level Ops View |
| `/analytics` | Hazard Analytics | Geotechnical Analyst | Caine rainfall intensity-duration curve, 72h rain vs risk, soil saturation | Evaluate slope failure risk | Toggle time ranges (24h/72h/7d); toggle zones | Top-Level Analytics |
| `/model-intelligence` | Model Intelligence | Researcher / Evaluator | Heuristic weight formulas, Random Forest ROC-AUC metrics, feature rankings | Verify scoring transparency | Compare heuristic vs ML output; review limitations | Top-Level Technical View |
| `/data-sources` | Data Provenance | Evaluator / Data Lead | Catalog of GSI, IMD, DEM, and Simulator sources; update times; health | Verify data lineage & health | Review dataset limitations; check sync timestamps | Top-Level Lineage View |

---

## 3. Global Application Shell & Navigation Layout

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: [Logo: LEWS] | Status: WebSocket LIVE | Simulator: CLOUDBURST | Fresh: 3s ago | Alert🔔 │
├──────────────┬──────────────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN CONTENT WORKSPACE AREA                                                      │
│              │                                                                                  │
│ [MONITOR]    │                                                                                  │
│ • Overview   │  (Active Route Content: Dashboard / Map / Zones / Alerts / Analytics / etc.)     │
│ • Risk Map   │                                                                                  │
│ • Zones      │                                                                                  │
│ • Alerts (2) │                                                                                  │
│              │                                                                                  │
│ [ANALYZE]    │                                                                                  │
│ • Analytics  │                                                                                  │
│ • Model Intel│                                                                                  │
│ • Sources    │                                                                                  │
│              │                                                                                  │
│ [SYSTEM]     │                                                                                  │
│ • Status/Docs│                                                                                  │
│ [<< Collapse]│                                                                                  │
└──────────────┴──────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Sidebar Navigation Groups & Behavior
- **Visual Design**: Dark charcoal navigation container (`#0b0f17`), hairline right border (`rgba(255,255,255,0.08)`), $240\text{px}$ width expanded, $68\text{px}$ width collapsed.
- **Navigation Groups**:
  1. **MONITOR**:
     - `Overview` (Icon: `LayoutDashboard`, Route: `/overview`)
     - `Risk Map` (Icon: `Map`, Route: `/map`)
     - `Zones` (Icon: `Layers`, Route: `/zones`)
     - `Alerts` (Icon: `BellRing`, Route: `/alerts`, includes live numeric badge for active critical alerts: `[ 2 ]`)
  2. **ANALYZE**:
     - `Analytics` (Icon: `LineChart`, Route: `/analytics`)
     - `Model Intelligence` (Icon: `Cpu`, Route: `/model-intelligence`)
     - `Data Sources` (Icon: `Database`, Route: `/data-sources`)
  3. **SYSTEM**:
     - `System Health / Docs` (Icon: `Activity`, Route: `/data-sources`)
     - `Collapse Sidebar` (Icon: `ChevronLeft` / `ChevronRight`)
- **Active State**: High-contrast text (`#ffffff`), emerald/sky-blue accent pill (`bg-white/10 text-white font-medium`), subtle left accent indicator.
- **Collapsed State**: Displays icons only with floating micro-tooltips on hover.

---

## 4. Top Header & System State Bar

The top header is the heartbeat of real-time situational awareness, visible across all pages.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [🏔️ LEWS: Wayanad District]  |  🟢 WebSocket: LIVE  |  ⚡ SIMULATION MODE  |  🕒 4s ago  |  🔔 (2) │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1. Header Indicators & States
1. **Region / District Selector**: Displays current monitoring basin: `"Wayanad Hazard Sector — Western Ghats"`.
2. **WebSocket Realtime Health Badge**:
   - 🟢 `LIVE (Connected)`: Solid green dot, zero latency.
   - 🟡 `RECONNECTING...`: Pulsing yellow dot, non-blocking toast warning.
   - 🔴 `OFFLINE`: Solid red dot, cached snapshot mode active.
3. **Simulation Status Badge**:
   - Prominently styled in high-contrast amber (`bg-amber-500/15 text-amber-300 border border-amber-500/30`).
   - Text: `⚡ SIMULATOR: Scenario #3 (Cloudburst)`.
   - Tooltip: *"Synthetic telemetry stream active for testing & demonstration."*
4. **Data Freshness Indicator**:
   - Displays exact elapsed time: `"Telemetry updated 4s ago"`.
   - Turns amber if $>60\text{s}$ elapse without a new telemetry packet.
5. **Quick Alert Drawer Toggle**:
   - Bell icon with red badge count for unresolved High/Critical alerts. Clicking opens a quick alert preview drop-down.

---

## 5. Overview UX: 4-Level Information Hierarchy

The Overview page is structured around an executive-first layout that displays critical emergency context **above the fold**.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: SITUATION AWARENESS METRIC CARDS (Above the Fold)                                       │
├────────────────────────┬────────────────────────┬────────────────────────┬───────────────────────┤
│ MONITORED SECTORS      │ REGIONAL AVG RISK      │ ACTIVE CRITICAL ALERTS │ 24H PEAK PRECIPITATION│
│ 12 Catchments          │ 0.42 (Moderate)        │ 2 Active [Red Badge]   │ 184.2 mm (Zone 01)    │
├────────────────────────┴────────────────────────┴────────────────────────┴───────────────────────┤
│ LEVEL 2 & 3: SPLIT OPERATIONAL CANVAS                                                            │
├──────────────────────────────────────────────────────┬───────────────────────────────────────────┤
│ LEVEL 2: GEOGRAPHIC SITUATION (Left 60% Width)       │ LEVEL 3: OPERATIONAL ATTENTION (Right 40%)│
│ ┌──────────────────────────────────────────────────┐ │ ┌───────────────────────────────────────┐ │
│ │ INTERACTIVE MINI RISK MAP                        │ │ │ TOP AT-RISK ZONES TABLE               │ │
│ │ • Color-coded zone polygons                      │ │ │ 1. Zone 01 (Meppadi)  - 0.84 [CRIT]   │ │
│ │ • Pulsing red indicator on Zone 01 & 07          │ │ │ 2. Zone 07 (Chooral)  - 0.81 [CRIT]   │ │
│ │ • Click zone to trigger Zone Drawer              │ │ │ 3. Zone 04 (Vellar)   - 0.58 [MOD]    │ │
│ │ • [ Expand to Full Map CTA ]                     │ │ ├───────────────────────────────────────┤ │
│ └──────────────────────────────────────────────────┘ │ │ RECENT ALERTS FEED                    │ │
│                                                      │ │ 🚨 [CRIT] 14:30 Zone 01 Rain >300mm   │ │
│                                                      │ │ 🚨 [CRIT] 14:28 Zone 07 Slope Sat >85%│ │
│                                                      │ └───────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┴───────────────────────────────────────────┤
│ LEVEL 4: HISTORICAL & SCENARIO CONTEXT (Below the Fold)                                          │
│ [ 72-Hour District Rainfall & Hazard Trajectory Chart ]  |  [ Scenario Simulator Quick Trigger ] │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Interactive Risk Map UX

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MAP CONTROLS: [ Zoom + / - ] [ Fit Bounds ] | Layer Toggles: [x] Risk [x] Rain [ ] History [ ]Sens│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│        Zone 04 (Green - 0.22)                         Zone 01 (Crimson - 0.84)                   │
│                                                          (Pulsing White Glow)                    │
│                                                                   │                              │
│                                                                   ▼                              │
│                    Zone 07 (Crimson - 0.81)           [ SLIDE-OVER DRAWER OPENS ]                │
│                                                       [ (See Section 7 & 8)     ]                │
│                                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ MAP LEGEND:  ● Low (<0.30)  ● Moderate (0.30–0.59)  ● High (0.60–0.79)  ● Critical (≥0.80)       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Map Canvas & Polygon Interactions
- **Default Viewport**: Auto-fitted to the bounding box of all monitored district polygons with $30\text{px}$ padding.
- **Layer Controls (Floating Top-Left Panel)**:
  - `[x] Hazard Zones (P0)`: Color-coded GeoJSON boundary polygons.
  - `[x] Rainfall Heatmap (P0)`: Interpolated continuous precipitation overlay.
  - `[ ] Historical Landslides (P1)`: Clustered markers for past debris flows.
  - `[ ] IoT Sensor Stations (P1)`: Location pins for physical rain gauges and piezometers.
- **Hover Interaction**: Hovering over any zone polygon dims non-hovered zones to $50\%$ opacity and opens a micro-tooltip displaying: `Zone Name | Risk Score | Primary Driver`.
- **Selection Interaction**: Clicking any zone triggers the **Map $\rightarrow$ Zone Slide-Over Drawer**.

---

## 7. Map $\rightarrow$ Zone Interaction & Drawer Behavior

```text
┌──────────────────────────────────────────────────────┬───────────────────────────────────────────┐
│ MAP REMAINS INTERACTIVE (60% Width)                  │ ZONE INTELLIGENCE SLIDE-OVER (40% Width)  │
│                                                      │                                           │
│ • Map pans slightly left to center selected polygon. │ • Width: 460px on desktop / 100% on mobile│
│ • Selected polygon outlined in bright white stroke.  │ • Smooth 250ms slide-in animation.       │
│ • User can still zoom, pan, or click another zone.   │ • Header displays Zone Name + Score + [X] │
│ • Clicking map backdrop or [X] dismisses drawer.     │ • User inspects drivers without leaving map│
└──────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```

### 7.1. Drawer Behavior Rules
1. **Zero Context Loss**: The map is never unmounted or hidden behind a full-page navigation.
2. **Smooth Pan Transition**: When a zone is clicked, the map smoothly pans leftward to position the zone in the visible $60\%$ left canvas.
3. **Multi-Zone Switching**: Clicking another zone polygon on the visible map immediately cross-fades the drawer content to the newly selected zone without closing/reopening the drawer.
4. **Keyboard Accessibility**: Pressing `Esc` closes the drawer and returns keyboard focus to the selected map polygon.

---

## 8. Zone Intelligence UX: Complete Drawer Structure

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Meppadi Catchment North (ID: zone-wayanad-01)                       [ Close (X) ]        │
│ HERO BADGE: [ 🚨 CRITICAL HAZARD — SCORE: 0.84 ] | Confidence: 91% | Updated: 6s ago             │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. RISK EXPLAINABILITY BREAKDOWN (Why is this zone risky?)                                       │
│    • 72h Antecedent Rainfall (310mm):  ████████████████████ 45% (Primary Critical Trigger)       │
│    • Terrain Slope Gradient (34.5°):   ████████████ 30% (Steep Failure Surface)                  │
│    • Soil Moisture Saturation (86%):   ██████ 15% (Elevated Pore Pressure)                       │
│    • Lithology & Historical Scars:     ████ 10% (Past Rupture Plane)                             │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. ENVIRONMENTAL & METEOROLOGICAL TELEMETRY GRID                                                 │
│    ┌────────────────────┬────────────────────┬────────────────────┬────────────────────┐         │
│    │ 24h Rainfall       │ 72h Rainfall       │ Soil Moisture      │ Slope Gradient     │         │
│    │ 142.6 mm (High)    │ 310.2 mm (Crit)    │ 86.4 % (Saturated) │ 34.5° (Steep)      │         │
│    └────────────────────┴────────────────────┴────────────────────┴────────────────────┘         │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. 72-HOUR PRECIPITATION VS. EMPIRICAL FAILURE THRESHOLD (Recharts Line Chart)                   │
│    [ Solid Line: Observed Rain Curve  ──  Dashed Red Line: Caine Failure Threshold Envelope ]    │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. AI SITUATION BRIEFING (Google Gemini - Strictly Grounded in Above Evidence)                   │
│    🤖 "Zone 01 exhibits critical instability driven by intense 72h precipitation (310.2mm)        │
│        exceeding empirical failure curves on a 34.5° slope. Precautionary evacuation of downslope│
│        settlements along Route 4 is recommended."                                                │
│    [ Tag: AI Advisory - Based on Real-Time Telemetry ]                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. HISTORICAL INCIDENTS & ACTIONS                                                                │
│    • 2019 Debris Flow (400m east) | 2024 Slope Scar (120m south)                                 │
│    [ Button: Acknowledge Zone Alert ]    [ Button: Open Full Analytics View ]                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Alert Operations & Acknowledgment Workflow

The alert experience is designed as an **operational command workflow**, not an ephemeral notification bell.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ALERT OPERATIONS CONSOLE                                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ FILTERS: [ All Alerts (14) ] [ Active Critical (2) ] [ Active High (3) ] [ Acknowledged (9) ]     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ALERT LISTING CARDS:                                                                             │
│                                                                                                  │
│ 🚨 [ CRITICAL ] Zone 01 (Meppadi Catchment North) ── Trigger Score: 0.84 ── 14:30:00 UTC         │
│    Trigger: 72h precipitation (310mm) and soil moisture (86%) breached critical failure limits. │
│    Status: [ ACTIVE - UNACKNOWLEDGED ]                                                           │
│    [ Button: 🛡️ Acknowledge Alert ]    [ Button: 🔍 Inspect on Map ]    [ Button: 📋 AI Brief ]   │
│                                                                                                  │
│ ⚠️ [ HIGH ] Zone 04 (Vellarimala Ridge) ── Trigger Score: 0.68 ── 14:22:15 UTC                   │
│    Trigger: 24h rainfall intensity (92mm/hr) rapidly accelerating on 38° slope.                  │
│    Status: [ ACKNOWLEDGED by Operator #04 at 14:25:10 UTC ]                                      │
│    [ Button: 🔍 Inspect on Map ]                                                                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.1. Alert Acknowledgment Modal Flow
1. Operator clicks **"Acknowledge Alert"**.
2. A lightweight operational dialog opens showing:
   - Alert ID, Zone Name, Dispatch Timestamp, and Triggering Score.
   - Optional text field: `"Operator Dispatch Notes"` (e.g., *"Notified Taluk Emergency Center"*).
3. Operator clicks **"Confirm Acknowledgment"**.
4. UI instantly updates status badge to `ACKNOWLEDGED`, records operator timestamp, silences audible chimes, and syncs across all connected WebSocket clients.

---

## 10. Alert Escalation & Threshold Transitions

The UI communicates escalating hazard conditions with disciplined, non-alarmist clarity:

```text
┌──────────────┬──────────────────┬─────────────────────────────┬──────────────────────────────────┐
│ TRANSITION   │ THRESHOLD RANGE  │ VISUAL & SOUND BEHAVIOR     │ OPERATIONAL MESSAGE CONVEYED     │
├──────────────┼──────────────────┼─────────────────────────────┼──────────────────────────────────┤
│ LOW → MOD    │ 0.00 → 0.30–0.59 │ Polygon turns Amber.        │ "Rainfall accumulating; advisory │
│              │                  │ No audible alarm.           │ monitoring active."              │
├──────────────┼──────────────────┼─────────────────────────────┼──────────────────────────────────┤
│ MOD → HIGH   │ 0.59 → 0.60–0.79 │ Polygon turns Orange.       │ "Hazard threshold approaching;   │
│              │                  │ Single subtle chime.        │ stage field response units."     │
├──────────────┼──────────────────┼─────────────────────────────┼──────────────────────────────────┤
│ HIGH → CRIT  │ 0.79 → 0.80–1.00 │ Polygon turns Red (pulsing).│ "Critical failure conditions;    │
│              │                  │ Repeating warning chime.    │ initiate evacuation protocols."  │
└──────────────┴──────────────────┴─────────────────────────────┴──────────────────────────────────┘
```

---

## 11. Analytics UX: Decision-Support Visualizations

The Analytics page prioritizes scientific decision support over decorative charts.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ROW 1: CORE DECISION-SUPPORT CHARTS (P0)                                                         │
├──────────────────────────────────────────────────────┬───────────────────────────────────────────┤
│ CHART 1: 72H PRECIPITATION ACCUMULATION VS. TIME     │ CHART 2: REGIONAL RISK SCORE DISTRIBUTION │
│ Plots rainfall trajectories for top 5 zones.         │ Histogram of current zone risk scores.    │
├──────────────────────────────────────────────────────┴───────────────────────────────────────────┤
│ ROW 2: HYDRO-GEOLOGICAL CORRELATION CHARTS (P1 & Experimental)                                   │
├──────────────────────────────────────────────────────┬───────────────────────────────────────────┤
│ CHART 3: SOIL MOISTURE VS. SLOPE SCATTER PLOT       │ CHART 4: CAINE INTENSITY-DURATION CURVE   │
│ Scatter of zones: Y=Soil Moisture (%), X=Slope (°)   │ [ Experimental ] $I = \alpha D^{-\beta}$  │
│ Highlights critical cluster in upper-right quadrant. │ Plots current storm intensity vs failure. │
└──────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```

---

## 12. Model Intelligence UX: Transparency & Lineage

Designed for technical evaluators and geotechnical modelers to verify calculation integrity:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ ACTIVE MODEL CARD: Heuristic Hydro-Geological Scoring Engine v1.2 (Deterministic Baseline) ]   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. FEATURE INPUTS & WEIGHT DISTRIBUTION MATRIX                                                   │
│    • Antecedent Rainfall Index (72h ARI)  ── Weight: 35% ── Dynamic Meteorological Ingestion     │
│    • Terrain Slope Gradient (DEM 30m)     ── Weight: 25% ── Static Topographic Model             │
│    • Soil Volumetric Moisture Saturation  ── Weight: 20% ── Dynamic Geotechnical Telemetry       │
│    • 24h Precipitation Intensity          ── Weight: 10% ── Dynamic Meteorological Ingestion     │
│    • Historical Landslide Spatial Density ── Weight: 10% ── Static GSI Inventory Layer           │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. EXPERIMENTAL MACHINE LEARNING SUSCEPTIBILITY BENCHMARK                                        │
│    • Algorithm: Random Forest Classifier (Scikit-Learn, n_estimators=100)                        │
│    • Benchmark Dataset: GSI Bhukosh Landslide Points (Western Ghats, 2014–2024)                  │
│    • Validation Metrics: ROC-AUC = 0.88 | Precision = 0.84 | Recall = 0.89                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. MODEL DISCLAIMER & GEOTECHNICAL BOUNDARIES                                                    │
│    ⚠️ This prototype uses empirical literature weights. In-situ calibration is required for life  │
│       safety deployment. Model does not replace site-specific geotechnical borehole analysis.    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Data Sources UX: Data Provenance & Lineage

The Data Sources view establishes absolute transparency by tagging every data stream:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DATA SOURCE REGISTRY                                                                             │
├───────────────────┬──────────────┬──────────────┬──────────────┬──────────────────┬──────────────┤
│ SOURCE / PROVIDER │ DATASET TYPE │ PROVENANCE   │ RESOLUTION   │ UPDATE FREQUENCY │ STATUS       │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼──────────────┤
│ Geological Survey │ Landslide    │ HISTORICAL   │ 1:50,000     │ Annual Baseline  │ 🟢 VERIFIED   │
│ of India (GSI)    │ Susceptib.   │              │ Polygons     │                  │              │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼──────────────┤
│ India Meteorol.   │ Gridded      │ REAL-WORLD   │ 0.25° Grid   │ Hourly Fetch     │ 🟢 CONNECTED │
│ Dept. (IMD)       │ Rainfall     │ (Observed)   │              │                  │              │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼──────────────┤
│ SRTM / Copernicus │ Digital      │ DERIVED      │ 30m Grid     │ Static Elevation │ 🟢 LOADED    │
│ Elevation Models  │ Elevation    │ (Spatial)    │              │                  │              │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼──────────────┤
│ Scenario Telemetry│ Rainfall &   │ SIMULATED    │ Zone Point   │ 3-Second Stream  │ 🟡 SIMULATOR │
│ Engine (LEWS-Sim) │ Soil Probes  │ (Synthetic)  │ Telemetry    │ (WebSocket)      │    ACTIVE    │
└───────────────────┴──────────────┴──────────────┴──────────────┴──────────────────┴──────────────┘
```

---

## 14. Realtime Experience & Simulation States

```text
┌─────────────────┬───────────────────────────────┬────────────────────────────────────────────────┐
│ REALTIME STATE  │ TOP BAR BADGE                 │ UI BEHAVIOR & RECOVERY PARADIGM                │
├─────────────────┼───────────────────────────────┼────────────────────────────────────────────────┤
│ 1. CONNECTED    │ 🟢 LIVE (WebSocket)           │ Telemetry cards update smoothly every 3s;      │
│                 │                               │ charts append new data points dynamically.     │
├─────────────────┼───────────────────────────────┼────────────────────────────────────────────────┤
│ 2. RECONNECTING │ 🟡 RECONNECTING (Attempt 2/5) │ Non-blocking yellow header banner; retains     │
│                 │                               │ existing telemetry; retries with backoff.      │
├─────────────────┼───────────────────────────────┼────────────────────────────────────────────────┤
│ 3. DISCONNECTED │ 🔴 OFFLINE (Cached View)      │ Header shows offline notice; displays last     │
│                 │                               │ cached state with timestamp; manual Reconnect. │
├─────────────────┼───────────────────────────────┼────────────────────────────────────────────────┤
│ 4. STALE DATA   │ 🕒 STALE (>60s elapsed)       │ Subtle clock indicator next to metric cards;   │
│                 │                               │ indicates sensor latency or field delay.       │
├─────────────────┼───────────────────────────────┼────────────────────────────────────────────────┤
│ 5. SIMULATOR    │ ⚡ SIMULATOR: Cloudburst      │ Prominent amber pill badge; ensures synthetic  │
│                 │                               │ data is never mistaken for live telemetry.     │
└─────────────────┴───────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 15. Loading States (Skeleton Loaders)

- **Avoid Full-Screen Spinners**: The application shell (Sidebar, Header) renders immediately.
- **Card-Level Shimmer**: StatCards, tables, and charts render subtle gray pulsating skeleton boxes matching their exact loaded dimensions.
- **Map Loading State**: Leaflet container renders dark gray background with centered subtle radar pulse: `"Loading catchment polygons..."`.
- **AI Summary Shimmer**: 3-line text shimmer placeholder inside the AI Briefing container.

---

## 16. Error States & Graceful Recovery

- **Backend Offline**: Toast banner at top: *"Cannot reach backend telemetry hub. Operating in cached offline mode. [ Retry ]"*.
- **Map Tile Load Error**: If external map tiles fail, the canvas falls back to a clean dark vector wireframe retaining GeoJSON polygons.
- **AI Generation Failure**: If Gemini API returns an error or is unconfigured, the AI Briefing box renders a deterministic fallback: *"AI Advisory currently offline. Risk drivers displayed in Heuristic Breakdown above."*
- **Single Sensor Failure**: If a zone's soil moisture probe is disconnected, the metric displays `"--"` with a subtle tooltip: `"Sensor offline; calculated with regional baseline"`.

---

## 17. Empty States

- **No Active Alerts**: Centered shield graphic with text: *"All Monitored Zones Stable — No active early warning alerts."*
- **No Zones Configured**: *"No spatial catchment zones loaded. Connect a GIS dataset or start the scenario simulator."*
- **No Historical Incidents**: *"No historical landslide occurrences recorded within this 2km catchment boundary."*

---

## 18. Responsive UX Transformations

```text
┌───────────────────────┬──────────────────────────────────────────────────────────────────────────┐
│ VIEWPORT              │ LAYOUT TRANSFORMATION & ADAPTATION                                       │
├───────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Desktop (≥1280px)     │ Full expanded sidebar ($240\text{px}$); 4-column StatCard grid;         │
│                       │ split-screen map ($60\%$) and slide-over drawer ($40\%$).                │
├───────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Laptop (1024–1279px)  │ Icon+label sidebar ($68\text{px}$); 2-column StatCard grid;             │
│                       │ map ($55\%$) and drawer ($45\%$).                                        │
├───────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Tablet (768–1023px)   │ Collapsible hamburger menu; single-column stacked metrics;              │
│                       │ full-screen modal inspector for selected zones.                          │
├───────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Mobile (<768px)       │ Tactical emergency triage: 1. Active Alerts Banner $\rightarrow$         │
│                       │ 2. Key Metrics $\rightarrow$ 3. Zone Risk List $\rightarrow$ 4. Map.    │
└───────────────────────┴──────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Search & Filtering Interactions

- **Zone Search**: Quick search input in the top header and Zone directory supporting name, ID, and taluk/block.
- **Severity Multi-Filter**: Filter chips on Map and Alerts views (`[x] Critical`, `[x] High`, `[ ] Moderate`, `[ ] Low`).
- **Map Layer Filter**: Interactive checkbox popover controlling visibility of rainfall heatmap and historical markers.

---

## 20. Key User Flows (Step-by-Step)

### Flow A: Morning Operational Situation Check
1. Operator arrives at DEOC and opens `http://localhost:5173/overview`.
2. Header indicates `🟢 WebSocket: LIVE` and `⚡ SIMULATOR ACTIVE`.
3. Operator scans 4 StatCards: 12 zones monitored, average risk $0.42$, 2 critical alerts active.
4. Top At-Risk table highlights Zone 01 (Meppadi, Score $0.84$) and Zone 07 (Chooralmala, Score $0.81$).
5. Operator clicks "View Full Map" to transition to spatial investigation.

### Flow B: Investigate High-Risk Sector on Map
1. Operator navigates to `/map`.
2. Map immediately renders two pulsing crimson polygons (Zone 01 and Zone 07).
3. Operator clicks on Zone 01 polygon.
4. Map smoothly pans left; Zone Intelligence slide-over drawer opens on the right.
5. Operator reviews the **Explainability Driver Breakdown**: $45\%$ of risk is driven by $310\text{mm}$ of 72h antecedent rain.
6. Operator reads the AI Situation Briefing: *"Precautionary evacuation of downslope settlements along Route 4 recommended."*

### Flow C: Respond to and Acknowledge an Emergency Alert
1. In the Zone Drawer, operator clicks **"Acknowledge Zone Alert"**.
2. Acknowledgment modal appears. Operator enters note: *"Dispatched local emergency team to inspect culvert drainage."*
3. Operator confirms. Alert status changes to `ACKNOWLEDGED` and red pulsing ring changes to a steady border.

### Flow D: Observe Real-Time Environmental Storm Scenario
1. Evaluator selects **"Scenario #3: Flash Cloudburst"** in the simulation controls.
2. Simulator streams rapid rainfall increases ($+25\text{mm/hr}$) via WebSocket.
3. Over 30 seconds, Zone 04 risk score climbs from $0.45$ (Amber) $\rightarrow$ $0.65$ (Orange) $\rightarrow$ $0.82$ (Red).
4. An alert banner drops down with an audible chime: *"CRITICAL ALERT: Zone 04 exceeded threshold 0.80"*.
5. Map polygon dynamically transitions to pulsing crimson.

### Flow E: Technical & Model Verification by Evaluator
1. Evaluator navigates to `/model-intelligence`.
2. Inspects deterministic hydro-geological weight formula ($35\%$ ARI rain, $25\%$ slope, $20\%$ soil).
3. Evaluates experimental Random Forest validation metrics (ROC-AUC: $0.88$).
4. Navigates to `/data-sources` to verify provenance of GSI landslide points and IMD rainfall grids.

---

## 21. Optimized 3-Minute Demonstration Script for SIH Judges

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             3-MINUTE WINNING DEMO SEQUENCE                                       │
├──────┬──────────────────────┬────────────────────────────────────────────────────────────────────┤
│ TIME │ SCREEN / ROUTE       │ NARRATIVE & OPERATIONAL ACTION                                     │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 0:00 │ `/overview`          │ "Welcome to LEWS. We provide real-time, explainable landslide      │
│      │                      │ intelligence for disaster management authorities."                 │
│      │                      │ Highlight 4 StatCards and live WebSocket status in top bar.        │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 0:30 │ `/map`               │ Transition to Risk Map. Show color-coded mountain catchments.      │
│      │                      │ Toggle rainfall heatmap overlay and historical landslide points.   │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 1:00 │ Click Zone 01        │ Open Zone Intelligence Drawer. Explain the 4-factor driver breakdown│
│      │ (Slide-Over Drawer)  │ (Why this zone is risky: 45% 72h rain, 30% steep 34.5° slope).     │
│      │                      │ Read the grounded Gemini situation briefing.                       │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 1:45 │ Trigger Simulator    │ Inject "Flash Cloudburst" scenario. Watch live telemetry stream.   │
│      │ (Real-Time Stream)   │ Show Zone 04 dynamically transition from Amber to Crimson on map.  │
│      │                      │ Demonstrate instant alert chime and notification dispatch.         │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 2:15 │ `/alerts`            │ Open Alert Operations Console. Acknowledge alert with audit note.  │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 2:40 │ `/model-intelligence`│ Show deterministic scoring formulas and experimental RF metrics.   │
│      │ & `/data-sources`    │ Show transparent data lineage (GSI, IMD, DEM).                     │
├──────┼──────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 3:00 │ Conclusion           │ "LEWS turns fragmented data into explainable, life-saving actions." │
└──────┴──────────────────────┴────────────────────────────────────────────────────────────────────┘
```

---

## 22. Core UX Principles Summary

1. **Situation Before Detail**: Broad district overview first; micro-catchment sensor telemetry on demand.
2. **Map Before Tables**: Geography and spatial proximity govern emergency decision-making.
3. **Explain Before Alarm**: Never display an alert without explaining the physical factors driving it.
4. **Evidence Before AI**: Gemini summarizes verified sensor data; it never invents numbers.
5. **Zero Context Loss**: Slide-over drawers keep the interactive map visible during zone investigations.
6. **Consistent Severity Language**: Emerald Green (Low), Amber (Moderate), Orange (High), Crimson Red (Critical).
7. **Transparent Simulation**: Synthetic data is always clearly marked as simulated.

---

## 23. Conceptual Component Inventory

```text
┌──────────────────────┬──────────────────────────────────────────┬────────────────────────────────┐
│ COMPONENT NAME       │ INPUT PROPS / DATA                       │ USER INTERACTION               │
├──────────────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ `AppShell`           │ Active route, navigation state           │ Manages sidebar & main canvas  │
│ `Sidebar`            │ Route links, active badge count          │ Navigates routes; collapses    │
│ `TopHeader`          │ WebSocket status, simulation state       │ Toggles region & alert drawer  │
│ `StatCard`           │ Title, value, change delta, severity     │ Hover tooltip for detail       │
│ `RiskMap`            │ GeoJSON zones, raster tiles, layer flags │ Zoom, pan, click zone polygon  │
│ `RiskLegend`         │ Severity color & score range thresholds  │ Visual reference guide         │
│ `ZoneDrawer`         │ Selected Zone telemetry, score, drivers  │ Slide-in inspector, close CTA  │
│ `RiskDriverBar`      │ Feature names, percentage contributions  │ Displays explainability ratios │
│ `TelemetryMatrix`    │ 24h/72h rain, moisture, slope, elevation │ Metric card grid display       │
│ `ThresholdChart`     │ Observed time-series vs Caine line       │ Recharts hover tooltips        │
│ `AIBriefingCard`     │ Gemini summary text, grounding metadata  │ Copy text, refresh briefing    │
│ `AlertFeed`          │ List of alert objects, filter state      │ Filter, sort, click to inspect │
│ `AlertAckModal`      │ Alert ID, zone info, operator note input │ Acknowledge & commit audit log │
│ `DataSourceCard`     │ Provider name, lineage, update frequency │ Click to inspect limitations   │
└──────────────────────┴──────────────────────────────────────────┴────────────────────────────────┘
```

---

## 24. UX Acceptance Criteria (P0 User Flows)

- **Scenario: Triage District Hazard Status**
  - **Given** an operator lands on the dashboard:
  - **Then** the highest-risk zone is identifiable in $<15\text{ seconds}$ without clicking.
- **Scenario: Inspect Zone Without Context Loss**
  - **Given** the operator is on the Risk Map:
  - **When** the operator clicks any zone polygon:
  - **Then** the map remains visible on the left and the drawer smoothly slides in from the right.
- **Scenario: Real-Time Scenario Reaction**
  - **Given** a simulated cloudburst occurs:
  - **When** telemetry packets arrive via WebSocket:
  - **Then** the corresponding map zone color changes within $<100\text{ ms}$ of arrival.

---

## 25. Final Design Direction Statement

> **LEWS delivers a calm, authoritative, map-centric operational intelligence environment that empowers disaster managers to seamlessly transition from broad situational awareness to micro-catchment physical evidence, automated alerts, and AI-assisted briefings without ever losing spatial context.**
