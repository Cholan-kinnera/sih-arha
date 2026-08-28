# LEWS Dynamic Risk Engine & Evidence Synthesis Audit

**Subsystem**: Multi-Factor Risk Evaluation, Rainfall Accumulation & Explainability
**Auditor**: Antigravity Automated Verification Agent
**Date**: 2026-08-28
**Status**: PASS

---

## 1. Dynamic Risk Formulation

The dynamic operational risk score $R \in [0.0, 1.0]$ is computed deterministically via normalized multi-factor synthesis:

$$R = \frac{w_{\text{static}} \cdot S_{\text{static}} + w_{\text{terrain}} \cdot F_{\text{terrain}} + w_{\text{rain}} \cdot F_{\text{rain}} + w_{\text{soil}} \cdot F_{\text{soil}} + w_{\text{hist}} \cdot F_{\text{hist}}}{\sum w_{\text{active}}}$$

- **Baseline Weights**:
  - $w_{\text{rain}} = 0.35$ (Dynamic 72h / 24h Rainfall Factor)
  - $w_{\text{terrain}} = 0.25$ (Terrain Slope & Ruggedness Factor)
  - $w_{\text{soil}} = 0.20$ (Dynamic Soil Moisture Saturation Factor)
  - $w_{\text{static}} = 0.15$ (ML Macro-Scale Baseline Susceptibility Prior)
  - $w_{\text{hist}} = 0.05$ (Historical Landslide Spatial Proximity Context)

---

## 2. Thresholds & Canonical Severity Mapping

Scores map strictly to four discrete operational tiers:

| Score Range | Severity Tier | Action Required |
| :--- | :--- | :--- |
| $[0.00, 0.30)$ | **LOW** | Routine monitoring, standard telemetry ingest. |
| $[0.30, 0.60)$ | **MODERATE** | Heightened surveillance, 6-hour polling cycle. |
| $[0.60, 0.80)$ | **HIGH** | Operator advisory triggered, culvert patrol alerted. |
| $[0.80, 1.00]$ | **CRITICAL** | Immediate emergency alert dispatch & evacuation triage. |

---

## 3. Explainability & RiskEvidenceBundle

- **Auditable Evidence**: Every evaluation produces a `RiskEvidenceBundle` containing the raw factor contributions, active weights used, data freshness timestamps, provenance badges, degraded mode indicators, and an auditable situation brief.
- **Degraded Mode**: When terrain or geotechnical sensors are missing, weights are dynamically renormalized over available factors without distorting risk scores.
- **Zero LLM Requirement**: All evidence summaries and mathematical explanations are generated via deterministic, transparent logic.
