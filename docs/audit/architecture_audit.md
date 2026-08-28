# LEWS Production Architecture Audit

**Subsystem**: Overall System Architecture & Module Boundaries
**Auditor**: Antigravity Automated Verification Agent
**Date**: 2026-08-28
**Status**: PASS WITH WARNINGS

---

## 1. System Structure & Top-Level Module Map

The LEWS (SIH26001) codebase is structured as a decoupled monorepo supporting scientific data engineering, ML inference, a real-time risk engine, an asynchronous FastAPI ASGI backend, and a React 19 single-page application:

```
sih-arha/
├── apps/
│   ├── api/                     # FastAPI ASGI backend service & database persistence
│   │   ├── alembic/             # PostGIS database migrations
│   │   ├── app/
│   │   │   ├── api/routes/      # Health, Zones, Risk, Alerts, Sources, Telemetry
│   │   │   ├── db/              # SQLAlchemy 2.x models, custom types, session
│   │   │   ├── schemas/         # Pydantic DTO models
│   │   │   └── services/        # Business logic & intelligence layer bridges
│   │   └── seed.py              # Canonical database seeder (641 zones, 5 sources)
│   └── web/                     # React 19 / Vite / Tailwind CSS v4 frontend
│       └── src/
│           ├── components/      # UI primitives, layout, risk & provenance badges
│           ├── features/        # Feature slices (overview, risk-map, zones, alerts, etc.)
│           ├── hooks/           # useTelemetryStream global real-time hook
│           ├── lib/api/         # Centralized HTTP/WebSocket API client layer
│           └── stores/          # Zustand state stores (useRealtimeStore, useUiStore)
├── src/
│   ├── data/                    # Raw loaders, cleaning, geography normalization, pipeline
│   ├── geospatial/              # Coordinate parsing, DEM slope/aspect/TRI, zonal stats
│   └── risk/                    # Rainfall accumulator, dynamic risk engine, evidence bundles
├── ml/
│   ├── artifacts/               # Serialized champion model (.joblib) & metadata (.json)
│   ├── inference/               # SusceptibilityPredictor inference service
│   └── training/                # Stratified group cross-validation & model training
├── data/
│   ├── raw/                     # Immutable raw data files (GSI landslides, IMD rainfall)
│   ├── processed/               # Cleaned CSV & Parquet artifacts (lews_baseline_dataset)
│   └── reports/                 # Machine-generated lineage and quality audit reports
└── tests/
    ├── api/                     # FastAPI endpoint integration & vertical slice tests
    ├── test_async_database.py   # SQLAlchemy 2.x async schema & PostGIS model tests
    └── test_*.py                # Data engineering, ML, terrain, rainfall & risk tests
```

---

## 2. Architectural Integrity & Boundary Checks

| Criterion | Status | Audit Findings |
| :--- | :--- | :--- |
| **Separation of Concerns** | PASS | React frontend is purely a presentation layer; it contains zero risk/ML formulas. Risk calculations and ML inference reside exclusively in `src/risk/` and `ml/`. |
| **Module Reusability** | PASS | `apps/api` imports directly from `src/risk/` and `ml/inference/` without code duplication. |
| **Circular Dependencies** | PASS | No circular imports detected between `src/data`, `src/geospatial`, `src/risk`, `ml`, and `apps/api`. |
| **Hard-Coded Host Paths** | PASS | All paths use dynamic `Path(__file__).resolve()` or relative references from repository root. No machine-specific absolute paths in code. |
| **Credentials & Secrets** | PASS | No real private API keys, database credentials, or production tokens are hardcoded. Development fallbacks exist for local prototyping. |
| **Artifact Separation** | PASS | Intermediate files and scratch databases (`test_seed.db`, `test_lews.db`) are excluded via `.gitignore`. |

---

## 3. Detected Architecture Warnings & Technical Debt

### Warning 1: Database Engine Fallback in API Session
- **Severity**: LOW
- **File**: `apps/api/app/db/session.py` (Lines 18–35)
- **Finding**: The database session initializes a synchronous `engine` using `DATABASE_URL` (defaulting to SQLite for lightweight test environments). In production on Render, `DATABASE_URL` must use `postgresql+asyncpg://...`.
- **Recommendation**: For Phase 8 deployment, ensure environment configuration on Render provides `DATABASE_URL` pointing to Supabase PostgreSQL, and verify that the sync fallback is restricted strictly to test harnesses.

### Warning 2: Single Monolithic Bundle Warning in Vite Build
- **Severity**: INFO
- **File**: `apps/web/vite.config.ts`
- **Finding**: Vite build emits a warning that `dist/assets/index-r4zGTRyj.js` is 1,302 kB (> 500 kB recommended chunk limit) due to bundling Recharts and Leaflet into the main entrypoint.
- **Recommendation**: In Phase 8, add `manualChunks` in `vite.config.ts` to code-split `recharts`, `leaflet`, and `framer-motion` into separate vendor chunks for faster initial asset download.
