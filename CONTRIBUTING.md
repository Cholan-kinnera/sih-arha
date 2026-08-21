# Contributing to Citizen Benefits Intelligence Platform (CBIP)

Welcome to the **Citizen Benefits Intelligence Platform (CBIP)** repository for **Smart India Hackathon 2026** (Problem Statement **PSS1 — Government Scheme Awareness and Eligibility Assistant**).

This document outlines our engineering standards, development workflow, team roles, and architectural rules. All contributors are expected to read and follow these guidelines.

---

## 1. Core Architectural Principles

All engineering work must strictly adhere to our foundational principles:

1. **Separation of Responsibilities**:
   $$\text{LLM} \neq \text{Eligibility Engine} \neq \text{Verification Authority}$$
   - **LLM**: Responsible for natural language understanding (NLU), multi-lingual translation, user query intent parsing, grounded answer synthesis, and OCR text extraction assistance.
   - **Eligibility Engine**: Deterministic, auditable, and versioned rule evaluation. The LLM MUST NOT be used to make final eligibility determinations.
   - **Verification Authority**: Explicit document evidence verification lifecycle, state management, and re-verification triggers when evidence becomes outdated.

2. **Modular Monolith**:
   - Maintain clear domain boundaries within `apps/api`. Do not create microservices without explicit technical lead approval and a documented Architecture Decision Record (ADR).

3. **Source Provenance & Grounding**:
   - All scheme details, rules, and RAG knowledge MUST be grounded in authoritative government sources (official portals, gazette notifications, official guidelines).
   - Inventing or hallucinating scheme information is strictly prohibited.

4. **Auditability & Explainability**:
   - Every eligibility outcome must produce a transparent, step-by-step explanation detailing met criteria, unmet criteria, and missing required documents.

5. **Secrets & Privacy Protection**:
   - Never hardcode secrets, private keys, or API tokens.
   - Never commit `.env` files or credentials to version control.
   - Treat all citizen data as sensitive; avoid persisting raw PII unnecessarily.

---

## 2. Team Structure & Domain Ownership

| Team Member | Role | Core Domain / Focus Area |
| :--- | :--- | :--- |
| **Technical Lead** | Lead Architect / Tech Lead | Overall Architecture, FastAPI Backend, AI/RAG integration, Core Systems |
| **Developer 2** | Frontend Engineer | `apps/web` (React + TypeScript + Vite + Tailwind CSS), UI/UX Design System |
| **Developer 3** | AI/RAG Specialist | `ai/rag`, `ai/prompts`, Scheme Knowledge Base & Vector Embeddings |
| **Developer 4** | Document Intelligence & DevOps | Document Verification, OCR Workflows, `infra/docker`, CI/CD Pipelines |
| **Member 5** | Research & Tech Documentation | `docs/`, Scheme Research & Verification, LaTeX Documentation |
| **Member 6** | Product, Demo & Presentation | User Flows, Presentation Deck, Pitch Preparation, Demo Scenarios |

---

## 3. Recommended Directory Structure

```
.
├── apps/
│   ├── api/             # Python FastAPI backend application (Modular Monolith)
│   └── web/             # React + TypeScript + Vite + Tailwind CSS frontend application
├── ai/
│   ├── rag/             # Grounded retrieval & RAG pipelines
│   ├── prompts/         # System prompts and generation templates
│   └── evaluation/      # RAG evaluation metrics and test datasets
├── packages/
│   └── shared/          # Shared Pydantic schemas, types, DTOs, and constants
├── data/
│   ├── schemes/         # Structured scheme definition specs (YAML/JSON)
│   ├── sources/         # Official source metadata and citation registries
│   └── knowledge/       # Preprocessed documents and vector index stores
├── docs/
│   ├── architecture/    # Architecture diagrams, system models, domain flows
│   ├── decisions/       # Architecture Decision Records (ADRs)
│   ├── research/        # Scheme research notes, target persona analyses
│   └── api/             # OpenAPI / AsyncAPI specifications
├── infra/
│   ├── docker/          # Dockerfiles & Docker Compose setup
│   └── ci/              # GitHub Actions workflows & CI scripts
└── tests/               # End-to-end & cross-domain integration test suites
```

---

## 4. Development Workflow & Git Conventions

### Branch Naming Convention
- `main`: Stable, production-ready branch (protected).
- `feat/<domain>-<feature-name>` (e.g., `feat/eligibility-rule-parser`, `feat/web-scheme-card`).
- `fix/<issue-name>` (e.g., `fix/doc-verification-status-bug`).
- `docs/<doc-title>` (e.g., `docs/adr-001-architecture`).

### Commit Message Guidelines
We follow **Conventional Commits**:
- `feat(api): add deterministic rule evaluator for PM-KISAN`
- `fix(web): fix document upload progress display`
- `docs(adr): add ADR-001 project architecture`
- `ci(docker): configure postgres service in docker-compose`

### Architecture Decision Records (ADRs)
- Any major architectural decision must be documented as an ADR in `docs/decisions/`.
- ADRs must follow the format defined in `docs/decisions/ADR-001-project-architecture.md`.

---

## 5. Engineering Standards & Quality Controls

- **Python (Backend & AI)**:
  - PEP 8 compliance, formatted with `black`/`ruff`.
  - Type hints required for all public functions (`mypy` strict mode).
  - Use `Pydantic v2` for API schemas and data validation models.
  - SQLAlchemy 2.0 style for ORM queries; Alembic for database migrations.

- **TypeScript (Frontend)**:
  - Strict mode enabled in `tsconfig.json`.
  - Clean component design with reusable Tailwind CSS utility classes.
  - ESLint and Prettier for code consistency.

- **Testing Requirements**:
  - Deterministic eligibility rules MUST be 100% unit tested with edge cases.
  - RAG components must be evaluated against grounding metrics to prevent hallucination.

---

## 6. What NOT to Do

- Do NOT create microservices without technical lead approval and an accepted ADR.
- Do NOT use LLMs for making final scheme eligibility decisions.
- Do NOT claim external government portal integration is "production live" without authorized API credentials.
- Do NOT commit mock or real API secrets or credentials to git.
