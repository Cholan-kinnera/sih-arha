# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Status-Phase_0_Foundation-amber?style=flat-square)](docs/DEVELOPMENT_ROADMAP.md)

An intelligent, explainable, and real-time hazard monitoring platform designed to assess landslide susceptibility, compute hydro-meteorological risk indices, and broadcast low-latency early warning alerts for vulnerable mountainous and hilly regions.

---

## 1. Problem Statement

Landslides pose an escalating threat to communities living in vulnerable terrains such as the Western Ghats and the Himalayas. Triggered by intense monsoon downpours, high pore-water pressure, and slope instability, landslides often strike with minimal warning. 

Key challenges in existing disaster response systems include:
- **Delayed Warning Dissemination**: Traditional regional alerts lack localized spatial granularity.
- **Black-Box Scoring**: Operators and local authorities cannot easily interpret why a specific slope is flagged as hazardous.
- **Disjointed Sensor Telemetry**: Lack of integrated real-time streams combining antecedent rainfall, Digital Elevation Models (DEM), and soil moisture.
- **Absence of Actionable Scenario Modeling**: Emergency teams lack simulation tools to test threshold responsiveness before extreme cloudburst events strike.

---

## 2. Proposed Solution

This platform establishes an end-to-end early warning and risk monitoring pipeline:

- 🛰️ **Geospatial Hazard Zoning**: High-resolution spatial mapping of monitored sectors with terrain slope, elevation, and geological classification.
- 🌧️ **Dynamic Risk Engine**: Hydro-geological threshold evaluation combining 24h/72h Antecedent Rainfall Index ($ARI$), soil moisture saturation, and slope gradients.
- 🔍 **Explainable AI/ML Scoring**: Transparent decomposition of hazard scores into explicit contributing factor percentages.
- ⚡ **Realtime Telemetry & WebSockets**: Zero-latency telemetry streaming from remote IoT sensors and scenario simulators directly to an operator dashboard.
- 🚨 **Automated Alert Dispatch**: Multi-tier alert hierarchy (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`) with operator acknowledgment workflows.
- 🧪 **Environmental Scenario Simulator**: Configurable simulation engine to evaluate disaster scenarios (monsoon downpours, cloudburst events).
- 🤖 **Advisory AI Assistance**: Natural-language situation reports and multi-lingual emergency advisories powered by Google Gemini (strictly advisory, non-deterministic).

---

## 3. High-Level System Architecture

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

For complete technical specifications, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/PROJECT_BLUEPRINT.md](docs/PROJECT_BLUEPRINT.md).

---

## 4. Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Leaflet, Recharts, Lucide | High-performance geospatial situational dashboard |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy (Async) | High-throughput REST & WebSocket orchestration engine |
| **Database** | SQLite (via `aiosqlite` / SQLAlchemy Async) | Lightweight, zero-config local time-series and spatial store |
| **Analytics & ML** | NumPy, Pandas, Scikit-learn, XGBoost | Hydro-geological heuristics & susceptibility models |
| **Simulation** | Python Async Event Engine | Synthetic rainfall and IoT environmental telemetry stream |
| **AI / LLM** | Google Gemini API (Interactions / Python SDK) | Natural-language operator summaries and advisories |

---

## 5. Repository Structure

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
│   ├── raw/             # Raw DEM, geological, and rainfall files (gitignored)
│   ├── processed/       # Cleaned & transformed tabular/raster datasets
│   ├── features/        # Precomputed spatial & temporal feature arrays
│   └── metadata/        # Data catalogs and source provenance records
│
├── docs/                # Architecture, blueprints, roadmaps, and data contracts
│   ├── ARCHITECTURE.md
│   ├── PROJECT_BLUEPRINT.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── DATA_CONTRACT.md
│   └── ENVIRONMENT.md
│
├── tests/
│   ├── backend/         # FastAPI backend unit & integration tests
│   ├── frontend/        # React dashboard UI component tests
│   ├── ml/              # Risk engine calculation & ML tests
│   └── integration/     # End-to-end pipeline & WebSocket stream tests
│
├── scripts/             # Setup, seeding, simulation, and data utility scripts
│
├── .env.example         # Sanitized environment template
├── .gitignore           # Git ignore rules for secrets, DBs, and large data
└── README.md            # Master repository overview
```

---

## 6. Data & Machine Learning Strategy

1. **Data Provenance**: Grounded in authoritative public datasets including Geological Survey of India (GSI) landslide inventories, India Meteorological Department (IMD) rainfall records, and SRTM/Copernicus Digital Elevation Models.
2. **Deterministic Risk Baseline**: A physics-informed, hydro-geological heuristic engine (Caine-style precipitation intensity-duration thresholds and slope instability models) guarantees explainability and verifiable safety thresholds.
3. **Statistical ML Refinement**: Supervised classifiers (Random Forest / XGBoost) trained on historical landslide occurrence points provide probabilistic susceptibility scoring.
4. **AI Boundary**: Google Gemini is used solely as an advisory assistant for operator briefings and multi-lingual public advisories. Gemini is **never** used to compute primary risk scores.

For contract definitions, see [docs/DATA_CONTRACT.md](docs/DATA_CONTRACT.md).

---

## 7. Local Development Overview

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ & virtual environment

### 1. Environment Configuration
```bash
cp .env.example .env
```

### 2. Frontend Development (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```

### 3. Backend Development (`apps/api`)
```bash
# From workspace root
python -m venv .venv
source .venv/bin/activate
pip install -e apps/api

# Run API Server
uvicorn apps.api.src.main:app --reload --port 8000
```

---

## 8. Current Project Status & Roadmap

> [!NOTE]
> The repository has completed **Phase 0 (Foundation Reset & Architecture Specification)**. Core feature implementation will proceed sequentially per the roadmap.

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 0** | Repository Reset & Architecture Foundation | 🟢 Completed |
| **Phase 1** | Frontend Foundation & Theme Layout | 🚧 In Development |
| **Phase 2** | Backend Foundation & REST Schemas | 🚧 In Development |
| **Phase 3** | Database Models & Zone Seeding (SQLite) | ⏳ Scheduled |
| **Phase 4** | Data Ingestion & Feature Engineering | ⏳ Scheduled |
| **Phase 5** | Explainable Heuristic Risk Engine | ⏳ Scheduled |
| **Phase 6** | Environmental Scenario Simulator | ⏳ Scheduled |
| **Phase 7** | Realtime WebSockets & Telemetry Hub | ⏳ Scheduled |
| **Phase 8** | Dashboard & Map Integration | ⏳ Scheduled |
| **Phase 9** | Statistical ML Model (Susceptibility) | ⏳ Scheduled |
| **Phase 10** | Gemini Advisory & Explanation Layer | ⏳ Scheduled |
| **Phase 11** | End-to-End Test Suite | ⏳ Scheduled |
| **Phase 12** | Production Polish & Demo Hardening | ⏳ Scheduled |

Detailed milestone specifications are documented in [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md).
