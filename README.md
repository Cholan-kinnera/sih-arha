<div align="center">

# 🏔️ AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

**An intelligent, explainable, real-time hazard monitoring platform for vulnerable mountainous terrain.**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Status-Phase_0_Foundation-amber?style=flat-square)](docs/DEVELOPMENT_ROADMAP.md)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)

[Problem](#-problem-statement) • [Solution](#-proposed-solution) • [Architecture](#-high-level-system-architecture) • [Quickstart](#-quickstart) • [Roadmap](#-current-project-status--roadmap)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [High-Level System Architecture](#-high-level-system-architecture)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Data & Machine Learning Strategy](#-data--machine-learning-strategy)
- [Quickstart](#-quickstart)
- [Project Status & Roadmap](#-current-project-status--roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Landslides pose an escalating threat to communities living in vulnerable terrain such as the Western Ghats and the Himalayas. Triggered by intense monsoon downpours, high pore-water pressure, and slope instability, landslides often strike with minimal warning.

Key gaps in existing disaster response systems:

| Challenge | Impact |
| :--- | :--- |
| 🐢 **Delayed Warning Dissemination** | Regional alerts lack the spatial granularity to warn specific slopes or settlements in time |
| ⬛ **Black-Box Scoring** | Operators and local authorities can't interpret *why* a slope is flagged as hazardous |
| 🔌 **Disjointed Sensor Telemetry** | No integrated real-time stream combining antecedent rainfall, DEM, and soil moisture |
| 🧪 **No Scenario Modeling** | Emergency teams can't stress-test alert thresholds before an extreme cloudburst hits |

---

## 💡 Proposed Solution

An end-to-end early warning and risk monitoring pipeline, built around five principles: **explainability, low latency, spatial precision, operator control, and human-in-the-loop AI.**

| | Capability | Description |
| :-- | :--- | :--- |
| 🛰️ | **Geospatial Hazard Zoning** | High-resolution mapping of monitored sectors with terrain slope, elevation, and geological classification |
| 🌧️ | **Dynamic Risk Engine** | Hydro-geological threshold evaluation combining 24h/72h Antecedent Rainfall Index (ARI), soil moisture saturation, and slope gradient |
| 🔍 | **Explainable AI/ML Scoring** | Transparent decomposition of hazard scores into explicit contributing-factor percentages — no black boxes |
| ⚡ | **Realtime Telemetry & WebSockets** | Zero-latency streaming from remote IoT sensors and scenario simulators straight to the operator dashboard |
| 🚨 | **Automated Alert Dispatch** | Multi-tier alert hierarchy (`LOW` → `MODERATE` → `HIGH` → `CRITICAL`) with operator acknowledgment workflows |
| 🧪 | **Environmental Scenario Simulator** | Configurable engine to model monsoon downpours, cloudbursts, and other disaster scenarios |
| 🤖 | **Advisory AI Assistance** | Natural-language situation reports and multi-lingual emergency advisories via Google Gemini — strictly advisory, never load-bearing for risk scores |

---

## 🏗️ High-Level System Architecture

```text
                  ┌──────────────────────────────────────┐
                  │            External Data              │
                  │   GSI · IMD · DEM · Soil · Weather    │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │     Data Processing & Features         │
                  │  Temporal aggregation, slope calc,     │
                  │  soil saturation & rainfall index      │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │          Risk Engine / ML              │
                  │  Explainable heuristic risk score       │
                  │  + optional ML classifier/regressor    │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │           FastAPI Backend               │
                  │   REST API + WebSocket Broadcast        │
                  │   Alert Engine + Session Management    │
                  └──────────────────┬───────────────────┘
                                     │
                ┌────────────────────┴────────────────────┐
                ▼                                          ▼
       ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
       │         React Dashboard          │       │          SQLite Database        │
       │  • Interactive Hazard Map        │       │  • Zones & Geometries           │
       │  • Realtime Risk Gauge           │       │  • Sensor & Weather Readings    │
       │  • Alert Feed & Timeline         │       │  • Risk Calculation History     │
       │  • Trend & Rainfall Analytics    │       │  • Generated Alerts             │
       │  • Explainability / Insights     │       │  • Model Metadata               │
       └─────────────────────────────────┘       └─────────────────────────────────┘
```

📄 Full technical specs: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/PROJECT_BLUEPRINT.md`](docs/PROJECT_BLUEPRINT.md)

---

## 🧰 Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Leaflet, Recharts, Lucide | High-performance geospatial situational dashboard |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy (Async) | High-throughput REST & WebSocket orchestration engine |
| **Database** | SQLite (via `aiosqlite` / SQLAlchemy Async) | Lightweight, zero-config local time-series and spatial store |
| **Analytics & ML** | NumPy, Pandas, Scikit-learn, XGBoost | Hydro-geological heuristics & susceptibility models |
| **Simulation** | Python Async Event Engine | Synthetic rainfall and IoT environmental telemetry stream |
| **AI / LLM** | Google Gemini API (Interactions / Python SDK) | Natural-language operator summaries and advisories |

---

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
│   ├── ARCHITECTURE.md
│   ├── PROJECT_BLUEPRINT.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── DATA_CONTRACT.md
│   └── ENVIRONMENT.md
│
├── tests/
│   ├── backend/          # FastAPI backend unit & integration tests
│   ├── frontend/          # React dashboard UI component tests
│   ├── ml/                # Risk engine calculation & ML tests
│   └── integration/       # End-to-end pipeline & WebSocket stream tests
│
├── scripts/              # Setup, seeding, simulation, and data utility scripts
│
├── .env.example           # Sanitized environment template
├── .gitignore              # Git ignore rules for secrets, DBs, and large data
└── README.md               # Master repository overview
```

---

## 🔬 Data & Machine Learning Strategy

1. **Data Provenance** — Grounded in authoritative public datasets: Geological Survey of India (GSI) landslide inventories, India Meteorological Department (IMD) rainfall records, and SRTM/Copernicus Digital Elevation Models.
2. **Deterministic Risk Baseline** — A physics-informed, hydro-geological heuristic engine (Caine-style precipitation intensity-duration thresholds and slope instability models) guarantees explainability and verifiable safety thresholds.
3. **Statistical ML Refinement** — Supervised classifiers (Random Forest / XGBoost) trained on historical landslide occurrence points provide probabilistic susceptibility scoring.
4. **AI Boundary** — Google Gemini is used *solely* as an advisory assistant for operator briefings and multi-lingual public advisories. Gemini is **never** used to compute primary risk scores.

📄 Contract definitions: [`docs/DATA_CONTRACT.md`](docs/DATA_CONTRACT.md)

---

## 🚀 Quickstart

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and a virtual environment tool

### 1. Configure environment

```bash
cp .env.example .env
```

### 2. Run the frontend (`apps/web`)

```bash
cd apps/web
npm install
npm run dev
```

### 3. Run the backend (`apps/api`)

```bash
# From the workspace root
python -m venv .venv
source .venv/bin/activate
pip install -e apps/api

uvicorn apps.api.src.main:app --reload --port 8000
```

The dashboard will be available locally once both services are running — see [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for full configuration options.

---

## 🗺️ Current Project Status & Roadmap

> **Phase 0 (Foundation Reset & Architecture Specification) is complete.** Core feature implementation proceeds sequentially per the roadmap below.

| Phase | Description | Status |
| :--- | :--- | :---: |
| 0 | Repository Reset & Architecture Foundation | 🟢 Completed |
| 1 | Frontend Foundation & Theme Layout | 🚧 In Development |
| 2 | Backend Foundation & REST Schemas | 🚧 In Development |
| 3 | Database Models & Zone Seeding (SQLite) | ⏳ Scheduled |
| 4 | Data Ingestion & Feature Engineering | ⏳ Scheduled |
| 5 | Explainable Heuristic Risk Engine | ⏳ Scheduled |
| 6 | Environmental Scenario Simulator | ⏳ Scheduled |
| 7 | Realtime WebSockets & Telemetry Hub | ⏳ Scheduled |
| 8 | Dashboard & Map Integration | ⏳ Scheduled |
| 9 | Statistical ML Model (Susceptibility) | ⏳ Scheduled |
| 10 | Gemini Advisory & Explanation Layer | ⏳ Scheduled |
| 11 | End-to-End Test Suite | ⏳ Scheduled |
| 12 | Production Polish & Demo Hardening | ⏳ Scheduled |

📄 Full milestones: [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md)

---

## 🤝 Contributing

Contributions are welcome, especially around the ML risk engine, geospatial preprocessing, and dashboard UX. Please open an issue to discuss significant changes before submitting a pull request, and make sure tests pass under `tests/` for any touched module.

## 📜 License

This project is licensed under the MIT License — see the [`LICENSE`](LICENSE) file for details.

---

<div align="center">

*Built to give vulnerable communities the seconds and minutes that save lives.*

</div>