<div align="center">

# 🏔️ LandslideGuard

### AI-Powered Early Warning & Risk Monitoring for Landslide-Prone Terrain

**Explainable. Real-time. Built to save lives before the ground moves.**

<br/>

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[![Made for Communities](https://img.shields.io/badge/Made_for-Vulnerable_Communities-red?style=flat-square)](#)
[![Explainable AI](https://img.shields.io/badge/AI-Explainable_by_Design-blueviolet?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

**[✨ Features](#-what-it-does)** · **[🏗️ Architecture](#️-system-architecture)** · **[🧰 Tech Stack](#-technology-stack)** · **[🚀 Get Started](#-quickstart)** · **[🔬 The Science](#-the-science-behind-the-score)**

</div>

<br/>

---

<br/>

## 🌩️ The Problem

> Landslides pose an escalating threat to communities across the **Western Ghats** and the **Himalayas**. Triggered by intense monsoon downpours, rising pore-water pressure, and slope instability, they strike with almost no warning — and existing systems aren't built to catch them in time.

<table>
<tr>
<td width="25%" align="center">🐢<br/><b>Too Slow</b><br/><sub>Regional alerts lack the spatial resolution to warn a specific slope in time</sub></td>
<td width="25%" align="center">⬛<br/><b>Too Opaque</b><br/><sub>Operators can't see *why* a hazard score was triggered</sub></td>
<td width="25%" align="center">🔌<br/><b>Too Fragmented</b><br/><sub>Rainfall, DEM, and soil telemetry live in disconnected silos</sub></td>
<td width="25%" align="center">🧪<br/><b>Too Untested</b><br/><sub>No way to simulate a cloudburst before one actually hits</sub></td>
</tr>
</table>

<br/>

## ✨ What It Does

<table>
<tr>
<td width="50%" valign="top">

### 🛰️ Geospatial Hazard Zoning
High-resolution mapping of monitored sectors — terrain slope, elevation, and geological classification, rendered as an interactive live map.

</td>
<td width="50%" valign="top">

### 🌧️ Dynamic Risk Engine
Hydro-geological threshold evaluation combining 24h/72h Antecedent Rainfall Index (ARI), soil moisture saturation, and slope gradient.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔍 Explainable AI/ML Scoring
Every hazard score decomposes into transparent, percentage-weighted contributing factors. No black boxes, no unexplainable red flags.

</td>
<td width="50%" valign="top">

### ⚡ Realtime Telemetry & WebSockets
Zero-latency streaming from IoT sensors and scenario simulators straight into the operator dashboard.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🚨 Automated Alert Dispatch
Multi-tier hierarchy — `LOW` → `MODERATE` → `HIGH` → `CRITICAL` — with full operator acknowledgment workflows.

</td>
<td width="50%" valign="top">

### 🧪 Environmental Scenario Simulator
Configurable engine to stress-test thresholds against monsoon downpours and cloudburst scenarios before they happen for real.

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### 🤖 Advisory AI Assistance
Natural-language situation reports and multi-lingual emergency advisories powered by **Google Gemini** — strictly advisory, never used to compute a risk score.

</td>
</tr>
</table>

<br/>

## 🏗️ System Architecture

```text
                  ┌──────────────────────────────────────┐
                  │              External Data             │
                  │      GSI · IMD · DEM · Soil · Weather  │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │       Data Processing & Features        │
                  │   Temporal aggregation · slope calc ·   │
                  │   soil saturation · rainfall index      │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │            Risk Engine / ML             │
                  │   Explainable heuristic risk score       │
                  │   + optional ML classifier/regressor     │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │             FastAPI Backend              │
                  │    REST API + WebSocket Broadcast        │
                  │    Alert Engine + Session Management     │
                  └──────────────────┬───────────────────┘
                                     │
                ┌────────────────────┴────────────────────┐
                ▼                                          ▼
       ┌──────────────────────────────┐        ┌──────────────────────────────┐
       │        React Dashboard         │        │        SQLite Database        │
       │  🗺️  Interactive Hazard Map    │        │  📍 Zones & Geometries        │
       │  📊  Realtime Risk Gauge       │        │  📡 Sensor & Weather Readings │
       │  🚨  Alert Feed & Timeline     │        │  📈 Risk Calculation History  │
       │  📉  Trend & Rainfall Charts   │        │  🔔 Generated Alerts          │
       │  🧠  Explainability Panel      │        │  🗃️ Model Metadata            │
       └──────────────────────────────┘        └──────────────────────────────┘
```

<div align="center"><sub>📄 Deep dives: <a href="docs/ARCHITECTURE.md"><code>docs/ARCHITECTURE.md</code></a> · <a href="docs/PROJECT_BLUEPRINT.md"><code>docs/PROJECT_BLUEPRINT.md</code></a></sub></div>

<br/>

## 🧰 Technology Stack

<div align="center">

| Layer | Stack |
| :--- | :--- |
| 🎨 **Frontend** | React 19 · Vite · TypeScript · Tailwind CSS · Leaflet · Recharts · Lucide |
| ⚙️ **Backend** | Python 3.10+ · FastAPI · Uvicorn · Pydantic v2 · SQLAlchemy (Async) |
| 🗄️ **Database** | SQLite via `aiosqlite` / SQLAlchemy Async |
| 📊 **Analytics & ML** | NumPy · Pandas · Scikit-learn · XGBoost |
| 🧪 **Simulation** | Python Async Event Engine |
| 🤖 **AI / LLM** | Google Gemini API (Interactions / Python SDK) |

</div>

<br/>

## 🔬 The Science Behind the Score

<table>
<tr><td>

**1. Data Provenance**
Grounded in authoritative public datasets — Geological Survey of India (GSI) landslide inventories, India Meteorological Department (IMD) rainfall records, and SRTM/Copernicus Digital Elevation Models.

**2. Deterministic Risk Baseline**
A physics-informed, hydro-geological heuristic engine — Caine-style precipitation intensity-duration thresholds and slope instability models — guarantees explainability and verifiable safety thresholds.

**3. Statistical ML Refinement**
Supervised classifiers (Random Forest / XGBoost) trained on historical landslide occurrence points provide probabilistic susceptibility scoring on top of the deterministic baseline.

**4. The AI Boundary**
Google Gemini is used **solely** as an advisory assistant for operator briefings and multi-lingual public advisories. It is **never** used to compute a primary risk score — every number on the dashboard traces back to a physical model you can audit.

</td></tr>
</table>

<div align="center"><sub>📄 Contract definitions: <a href="docs/DATA_CONTRACT.md"><code>docs/DATA_CONTRACT.md</code></a></sub></div>

<br/>

## 📁 Repository Structure

```text
/
├── apps/
│   ├── web/             # React + Vite + TypeScript dashboard application
│   └── api/             # FastAPI backend application (REST + WebSockets)
│
├── ml/
│   ├── training/        # ML model training scripts & pipelines
│   ├── preprocessing/   # Geospatial raster/vector & sensor preprocessing
│   ├── inference/       # Real-time risk engine & inference pipelines
│   └── models/          # Trained model weights & metadata registry
│
├── simulator/           # Environmental scenario & IoT sensor stream generator
│
├── data/
│   ├── raw/              # Raw DEM, geological, and rainfall files (gitignored)
│   ├── processed/        # Cleaned & transformed tabular/raster datasets
│   ├── features/         # Precomputed spatial & temporal feature arrays
│   └── metadata/          # Data catalogs and source provenance records
│
├── docs/                 # Architecture, blueprints, roadmaps, and data contracts
├── tests/                 # Backend, frontend, ML, and integration test suites
├── scripts/               # Setup, seeding, simulation, and data utility scripts
│
├── .env.example
└── README.md
```

<br/>

## 🚀 Quickstart

<table>
<tr><td>

**Prerequisites:** Node.js 18+ & npm · Python 3.10+ & a virtual environment tool

</td></tr>
</table>

```bash
# 1. Configure environment
cp .env.example .env
```

```bash
# 2. Frontend — apps/web
cd apps/web
npm install
npm run dev
```

```bash
# 3. Backend — apps/api (from workspace root)
python -m venv .venv
source .venv/bin/activate
pip install -e apps/api

uvicorn apps.api.src.main:app --reload --port 8000
```

Once both are running, open the dashboard locally and watch live telemetry flow in. Full configuration options live in [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).

<br/>

## 🤝 Contributing

Contributions are welcome — especially around the ML risk engine, geospatial preprocessing, and dashboard UX. Open an issue to discuss significant changes before submitting a PR, and make sure tests under `tests/` pass for anything you touch.

## 📜 License

Licensed under the [MIT License](LICENSE).

<br/>

---

<div align="center">

### Built to give vulnerable communities the seconds and minutes that save lives. 🏔️

<sub>If this project resonates with you, consider ⭐ starring the repo.</sub>

<<<<<<< HEAD
</div>

Detailed milestone specifications are documented in [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md).

### How SatQuery AI Works

SatQuery AI is designed to provide an interactive interface for analyzing remote sensing data through natural language queries. The system follows a modular pipeline:

1. **User Query** → The user submits a natural-language question.
2. **Query Processing** → The backend interprets the request and identifies the required analysis.
3. **Remote Sensing Analysis** → Relevant satellite data and derived features are processed.
4. **Risk & Scenario Analysis** → Analytical and simulation modules generate insights.
5. **AI Advisory** → The results are presented with explanations and recommendations.
6. **Visualization** → Results can be explored through the web dashboard and map interface.

This architecture allows the project to combine geospatial data processing, statistical analysis, machine learning, and generative AI into a single interactive platform.

>>>>>>> db3cd8c (docs: add SatQuery AI workflow overview)
