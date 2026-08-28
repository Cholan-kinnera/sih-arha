<div align="center">

# ⛰️ Terranex AI
### Next-Generation Landslide Hazard Monitoring & Early Warning Platform

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Status: Phase 0 Foundation](https://img.shields.io/badge/Status-Phase_0_Foundation-amber?style=for-the-badge)](docs/DEVELOPMENT_ROADMAP.md)

<p align="center">
  <b>A real-time hydro-meteorological risk pipeline combining physics-informed heuristics, statistical ML, high-resolution geospatial GIS, and zero-latency telemetry streaming to save lives in high-risk mountainous regions.</b>
</p>

[Key Features](#-key-features) •
[System Architecture](#-system-architecture) •
[Risk Engine Formula](#-physics-informed-risk-engine) •
[Getting Started](#-getting-started) •
[Roadmap](#-development-roadmap)

---

</div>

## 🎯 Abstract & Problem Statement

Landslides represent one of the most destructive geo-hazards in mountainous and hilly terrains across regions such as the Western Ghats and the Himalayas. Triggered by high-intensity monsoon downpours, transient pore-water pressure spikes, and localized slope degradation, these disasters unfold rapidly.

Existing disaster mitigation and response infrastructure suffers from critical shortcomings:

* **Coarse Spatial Resolution**: Regional alerts cover wide geographical grids without hyper-local terrain specificity.
* **Black-Box Obscurity**: ML models output raw risk percentages without breaking down contributing environmental drivers for incident commanders.
* **Sensor & Data Fragmentation**: Telemetry from rainfall gauges, soil moisture probes, and satellite Digital Elevation Models (DEM) operate in isolated silos.
* **Lack of Predictive Simulation**: Emergency response teams cannot simulate potential extreme weather scenarios (e.g., cloudbursts) to validate threshold alerts prior to actual events.

**Terranex AI** bridges these gaps with a unified, transparent, physics-grounded, and AI-boosted early warning network.

---

## ✨ Key Features

* 🛰️ **Geospatial GIS Engine**: Dynamic Leaflet/GeoJSON spatial vector mapping integrated with SRTM/Copernicus terrain slope analysis.
* 🌧️ **Dynamic Hydro-Geological Scoring**: Real-time evaluation of Antecedent Rainfall Index ($ARI$), soil moisture saturation percentage ($S_m$), and critical slope thresholds.
* 🔍 **Transparent Risk Factor Decomposition**: Fully explainable factor contributions (e.g., *Rainfall: 45%*, *Slope Angle: 35%*, *Soil Saturation: 20%*).
* ⚡ **Sub-Second Telemetry & WebSockets**: Low-latency event streaming architecture broadcasting IoT telemetry directly to state dashboards.
* 🚨 **Multi-Tiered Alert Hierarchy**: Four-stage automated alert pipeline (`LOW` 🟢, `MODERATE` 🟡, `HIGH` 🟠, `CRITICAL` 🔴) with operator confirmation states.
* 🧪 **Environmental Scenario Simulator**: Interactive sandbox engine to run cloudburst, monsoonal steady-state, and slope degradation scenarios.
* 🤖 **AI Advisory Agent (Google Gemini)**: Automated creation of incident commander situation reports and multi-lingual public emergency advisories. *(Note: Strictly non-deterministic/advisory; does not override primary mathematical risk scoring).*

---

## 🏗️ System Architecture

```text
                               ┌─────────────────────────────────────────┐
                               │           Geospatial & Ingestion        │
                               │                                         │
                               │  IMD Weather / GSI Records / DEM Data   │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │       Temporal Feature Engineering      │
                               │                                         │
                               │   Antecedent Rainfall Index (ARI)       │
                               │   Soil Saturation Index ($S_m$)         │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
┌──────────────────────────────┐                   ┌──────────────────────────────┐
│  Physics-Informed Heuristics │                   │ XGBoost / Random Forest ML   │
│  Intensity-Duration Threshold│ ───────────────►  │ Spatial Susceptibility Score │
└──────────────┬───────────────┘                   └──────────────┬───────────────┘
               │                                                  │
               └─────────────────────────┬────────────────────────┘
                                         │
                                         ▼
                       ┌───────────────────────────────────┐
                       │   FastAPI Async Pipeline          │
                       │                                   │
                       │  - REST API                       │
                       │  - WebSocket Telemetry Broadcast  │
                       │  - Automated Alert Lifecycle      │
                       └─────────────────┬─────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────┐
│ React 19 Operator Dashboard           │   │ SQLite / SpatiaLite Data Layer    │
│                                       │   │                                   │
│ - Interactive Map & Sector Layers     │   │ - Sector Geometries & Topography  │
│ - Live Gauge & Factor Breakdown       │   │ - Historical Sensor Telemetry     │
│ - Event Simulator & Control Console   │   │ - Alert Audits & Incident Logs    │
└───────────────────────────────────────┘   └───────────────────────────────────┘