# ADR-002: Canonical Scheme Specification Schema Design

- **Status**: Accepted
- **Date**: 2026-08-21
- **Deciders**: Technical Lead, Senior Staff Engineer
- **Consulted**: Developer 3 (AI/RAG), Developer 4 (Doc Intel), Member 5 (Research)

---

## Context & Problem Statement

The **Citizen Benefits Intelligence Platform (CBIP)** requires a standard machine-readable format to define government welfare schemes, their eligibility criteria, required documents, benefits, application procedures, and authoritative source citations.

Without a canonical data contract:
- Scheme research would be documented inconsistently in unstructured text.
- Eligibility logic might be hardcoded in Python `if/else` conditions, destroying auditability and decoupling.
- RAG ingestion would lack structured metadata filters and source citation linkages.
- The frontend UI would be tightly coupled to backend implementation details.

We need to establish a declarative, auditable, and extensible **Scheme Specification Schema** that serves as the single source of truth across all subsystems.

---

## Decision Drivers

1. **Declarative Rule Representation**: Eligibility criteria must be represented as structured data trees (AST) rather than executable code snippets or custom DSL scripts.
2. **Authoring Ergonomics**: The format must be easily readable and authorable by domain researchers without programming backgrounds.
3. **Machine Validation**: The data format must seamlessly translate into strong type contracts (Pydantic v2 in Python, JSON Schema in CI).
4. **Source Provenance**: Every scheme and rule must link back to authoritative government gazettes, portal URLs, and official guidelines.
5. **Decoupled Verification Lifecycle**: Document evidence requirements must be declared without embedding citizen verification state into the scheme model.

---

## Considered Options

### 1. Hardcoded Python Business Logic (Rejected)
- *Pros*: Simple to code initially.
- *Cons*: Non-auditable, requires code changes and deployments for scheme updates, impossible for research team members to maintain, no RAG metadata compatibility.

### 2. Custom Domain-Specific Language (DSL) (Rejected)
- *Pros*: Can write custom syntax like `ELIGIBLE IF income <= 300000 AND age >= 18`.
- *Cons*: High maintenance cost to write custom lexers/parsers, prone to syntax errors, poor tooling and IDE validation support.

### 3. Pure JSON Data Specifications (Rejected for Authoring)
- *Pros*: Native parser support across Python and TypeScript, robust JSON Schema validation.
- *Cons*: Poor human readability for multi-line text descriptions, lack of comments, cumbersome quote syntax for manual authoring by research team.

### 4. Canonical YAML Specifications with Pydantic / JSON Schema Validation (Chosen)
- *Pros*:
  - **Human-Readable**: Clean layout, comment support, multi-line string support (`|`).
  - **Interoperable**: Converts 1-to-1 into JSON / Python dicts.
  - **Strict Validation**: Validated programmatically via **Pydantic v2** models in FastAPI and **JSON Schema** in automated CI pipelines.
  - **No Custom DSL**: Standard nested mapping syntax with explicit operators (`LESS_THAN_OR_EQUAL`, `IN_SET`, `AND`, `OR`).

---

## Key Schema Architectural Choices

### 1. Four Distinct Eligibility Result States
We explicitly enforce four distinct eligibility evaluation states:
- `ELIGIBLE`: All mandatory rules passed with verified evidence.
- `NOT_ELIGIBLE`: At least one mandatory rule failed.
- `POTENTIALLY_ELIGIBLE`: Basic criteria passed; conditional/secondary verification pending.
- `INSUFFICIENT_INFORMATION`: Missing required citizen attributes (triggers targeted question prompt).

Combining or collapsing these states (e.g., treating `INSUFFICIENT_INFORMATION` as `NOT_ELIGIBLE`) is strictly forbidden.

### 2. Evidence Requirements vs. Verification Authority
Leaf rules declare *what* document type satisfies a condition (`evidence_requirement: document_type: INCOME_CERTIFICATE`). The scheme definition does **NOT** track whether a citizen's document is verified, valid, or expired. That status is managed separately by the **Verification Authority**.

### 3. Source Citation Grounding
The `sources` array acts as a first-class registry within each scheme file. Each rule and document requirement references a `source_id` and specific citation text, ensuring 100% grounding.

---

## Schema Validation Strategy

1. **Local Development / Authoring**: Scheme YAML files are written in `data/schemes/`.
2. **Automated CI Validation**: A CI step parses all YAML files against a generated JSON Schema / Pydantic model (`SchemeSpecification`) to catch syntax, type, and broken source link errors before PR merges.
3. **Runtime Ingestion**: `apps/api` loads validated scheme specs into memory / DB cache for fast deterministic rule evaluation.

---

## Consequences & Next Steps

- Research team members can author schemes independently using YAML templates.
- Backend engineers will implement the Pydantic validator and Rule Parser as the next foundation step.
- AI engineers will build RAG metadata indexers directly on top of canonical scheme fields.
