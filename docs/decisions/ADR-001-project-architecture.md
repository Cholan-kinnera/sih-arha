# ADR-001: Project Architecture — Monorepo Modular Monolith

- **Status**: Accepted
- **Date**: 2026-08-21
- **Deciders**: Technical Lead, Senior Staff Engineer
- **Consulted**: Developer 2 (Frontend), Developer 3 (AI/RAG), Developer 4 (Doc Intel/DevOps)

---

## Context & Problem Statement

The **Citizen Benefits Intelligence Platform (CBIP)** is being developed for **Smart India Hackathon 2026** under Problem Statement **PSS1 — Government Scheme Awareness and Eligibility Assistant**.

The mission of CBIP is to empower citizens to discover relevant welfare schemes, understand eligibility transparently, identify required documents, verify evidence, and prepare for applications with source-grounded explanation and multi-lingual assistance.

Given the hackathon timeline, project complexity, and team distribution, we require an architecture that:
1. Minimizes operational complexity and deployment overhead.
2. Prevents premature microservice fragmentation while enforcing strict domain boundaries.
3. Decouples natural language processing (LLM) from deterministic business rules (Eligibility Engine) and verification state management (Verification Authority).
4. Enables 6 team members to work concurrently without merge friction.

---

## Core Architectural Principle

$$\text{LLM} \neq \text{Eligibility Engine} \neq \text{Verification Authority}$$

- **LLM Component**: Responsible for natural language understanding (NLU), multi-lingual translation, user query formulation, grounded conversational synthesis, and OCR extraction assistance. The LLM **NEVER** makes authoritative eligibility determinations.
- **Eligibility Engine**: A deterministic, auditable, and versioned rule-based engine that evaluates structured scheme criteria against verified citizen profiles. It produces transparent, step-by-step audit trails detailing why a citizen is eligible or ineligible.
- **Verification Authority**: Manages document upload, OCR structure extraction, document validity lifecycles, provider abstractions (e.g., DigiLocker provider abstraction), and re-verification triggers when document evidence expires.

---

## Decision Drivers

* **Development Speed & Iteration Velocity**: A unified monorepo enables atomic commits across documentation, data definitions, AI pipelines, API backend, and web frontend.
* **Domain Isolation**: Clear directory boundaries allow backend, frontend, AI, and DevOps engineers to work independently without coupling implementation details.
* **Auditability & Grounding**: Government scheme details and eligibility logic must be auditable, versioned, and tied to official source citations.
* **Maintainability**: Low operational complexity compared to managing multiple repositories, inter-service networking, and distributed deployment pipelines.

---

## Considered Options

1. **Multi-Repo with Microservices Architecture** (Rejected):
   - *Pros*: Independent deployment pipelines per service.
   - *Cons*: High network latency, complex inter-service authentication, heavy CI/CD overhead, contract sync issues during rapid hackathon iteration.

2. **Single Monolithic Codebase with Mixed Concerns** (Rejected):
   - *Pros*: Quick initial prototype.
   - *Cons*: LLM logic mixed with DB models, hard to unit test eligibility independently, high merge conflict risk.

3. **Monorepo with Modular Monolith Architecture** (Chosen):
   - *Pros*: Single repository with strict domain boundaries (`apps/`, `ai/`, `packages/`, `data/`, `infra/`, `docs/`). Shared schemas, unified tooling, and deterministic eligibility testing fully isolated from LLM code.
   - *Cons*: Requires discipline to enforce domain boundaries and prevent cross-domain coupling.

---

## High-Level Project Structure

```
sih-arha/
├── apps/
│   ├── api/             # Python FastAPI backend application (Modular Monolith)
│   │   └── src/
│   │       ├── core/           # Config, security, base database setup
│   │       ├── domains/        # Business domains (schemes, eligibility, verification, profile)
│   │       └── api_v1/         # FastAPI router endpoints mapping HTTP to domain services
│   └── web/             # React + TypeScript + Vite + Tailwind CSS frontend application
├── ai/
│   ├── rag/             # Grounded retrieval pipelines, vector index loaders
│   ├── prompts/         # System prompts, grounded generation templates
│   └── evaluation/      # RAG evaluation scripts, ground-truth benchmarks
├── packages/
│   └── shared/          # Shared Pydantic schemas, constants, domain DTOs
├── data/
│   ├── schemes/         # Canonical scheme definitions (YAML/JSON schema specs)
│   ├── sources/         # Official source metadata, portal links, gazette references
│   └── knowledge/       # Preprocessed knowledge documents & vector index stores
├── docs/
│   ├── architecture/    # Architectural diagrams and design specifications
│   ├── decisions/       # Architecture Decision Records (ADRs)
│   ├── research/        # Scheme research, target persona profiles
│   └── api/             # OpenAPI / AsyncAPI specifications
├── infra/
│   ├── docker/          # Docker Compose configurations for local dev & DB
│   └── ci/              # CI/CD pipelines
└── tests/               # Cross-domain integration & end-to-end test suites
```

---

## Technology Stack Rationale

- **Backend**: Python 3.14 / 3.12 with **FastAPI** (high performance, async support, auto OpenAPI documentation), **PostgreSQL** (relational data consistency for citizen profiles and scheme criteria), **SQLAlchemy 2.0** + **Alembic** (ORM and migration management), **Pydantic v2** (strict data validation).
- **Frontend**: **React**, **TypeScript**, **Vite** (fast HMR build tool), **Tailwind CSS** (utility-first design system consistency).
- **AI / RAG**: Grounded RAG stack using vector retrieval, prompt templates with explicit citation enforcement, and an evaluation suite (`ai/evaluation/`) to benchmark grounding and guard against hallucinations.
- **Infrastructure**: **Docker** & **Docker Compose** for reproducible environments; **Redis** (where justified) for query caching and background task queues.

---

## Scope Boundaries: What is Intentionally NOT Implemented Yet

To maintain high engineering discipline and avoid superficial claims:
1. **Production DigiLocker API Integration**: Live DigiLocker integration requires formal government OAuth client credentials. We will implement a `DigiLockerProvider` abstraction layer with a simulated mock provider for development and testing.
2. **Automated Direct Application Submission**: CBIP evaluates eligibility, identifies required documents, and prepares citizens for application readiness; auto-submitting applications to external government portals without authorized integration APIs is strictly out of scope.
3. **Microservices Infrastructure**: Defer service splitting until production load or team scaling strictly warrants it.
4. **Un-audited Runtime Web Scraping**: Scheme data must be curated into grounded specs in `data/schemes/` with verified source citations rather than runtime un-audited web scraping.

---

## Verification & Compliance

- **Deterministic Verification**: Eligibility logic will be verified via unit tests against synthetic citizen profiles.
- **RAG Grounding**: RAG generation will be benchmarked against source documents in `data/sources/`.

---

## Next Steps

1. Establish placeholder files (`.gitkeep`) in `docs/architecture/`, `docs/research/`, and `docs/api/`.
2. Define the JSON/YAML schema for government scheme specifications in `data/schemes/`.
3. Proceed to initial backend foundation setup (FastAPI skeleton) upon lead approval.
