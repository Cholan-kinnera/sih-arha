# Contributing to AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

Welcome to the development repository for **AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas**.

This document outlines engineering standards, branch conventions, and workflow rules.

---

## 1. Core Engineering Principles

1. **Separation of Concerns**:
   - $\text{Simulator} \rightarrow \text{Data Ingestion} \rightarrow \text{Risk Engine / ML} \rightarrow \text{FastAPI Backend} \rightarrow \text{React Dashboard}$
   - The ML / Rule-based risk engine evaluates hazard levels and risk scores.
   - LLMs / Gemini are strictly advisory (natural-language summaries, operator assistance) and **never** calculate the primary numerical risk score.

2. **Clean Modularity & Minimal Dependencies**:
   - Keep boundaries clean between frontend, backend, simulator, and ML packages.
   - Avoid bloated dependencies or premature complexity.

3. **Reproducibility & Auditability**:
   - Every risk computation, threshold evaluation, and model inference must be explainable, deterministic, and traceable.

4. **Security & Secrets Discipline**:
   - Never commit API keys, secrets, or `.env` files.
   - Use `.env.example` as a template with placeholder values.

---

## 2. Repository Structure

```text
/
├── apps/
│   ├── web/             # React + Vite + TypeScript dashboard
│   └── api/             # FastAPI backend (REST + WebSockets)
├── ml/
│   ├── training/        # Model training pipelines
│   ├── preprocessing/   # Geospatial & sensor data feature engineering
│   ├── inference/       # Model inference engine & scoring
│   └── models/          # Model artifacts & registry metadata
├── simulator/           # Synthetic rainfall & sensor stream simulator
├── data/
│   ├── raw/             # Raw environmental & geological datasets
│   ├── processed/       # Cleaned & structured data
│   ├── features/        # Precomputed spatial/temporal features
│   └── metadata/        # Data catalogs & source provenance
├── docs/                # Architecture, blueprints, roadmaps, and contracts
├── tests/
│   ├── backend/         # FastAPI & service unit/integration tests
│   ├── frontend/        # React component & UI tests
│   ├── ml/              # ML pipeline & risk scoring validation tests
│   └── integration/     # End-to-end pipeline tests
└── scripts/             # Development, simulation, and data utility scripts
```

---

## 3. Git Workflow & Discipline

- `main`: Active development branch.
- `archive/cbit-project`: Preserved historical archive branch.
- Feature branches: `feat/<feature-name>`, `fix/<issue-name>`, `docs/<doc-name>`.
- Commit style: Conventional Commits (`feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
- Never commit secrets or large raw binary datasets to version control.
