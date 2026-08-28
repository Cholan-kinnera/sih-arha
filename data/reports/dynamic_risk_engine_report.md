# LEWS — Dynamic Multi-Factor Risk Engine Architecture & Calibration Report

Generated automatically for **SIH26001 (Phase 5B)**.

---

## 1. Executive Summary

Phase 5B implements the deterministic, explainable **Dynamic Risk Engine** that fuses:
1. **Static Spatial Susceptibility Prior ($S_{\text{static}}$)**: Output of the trained Phase 5A ML Baseline Model.
2. **Physical Terrain Derivatives ($F_{\text{terrain}}$)**: Zonal slope and roughness indices from 30m DEM grids.
3. **Dynamic Rainfall Telemetry ($F_{\text{rain}}$)**: Rolling $1\text{h}, 6\text{h}, 24\text{h}, 48\text{h}, 72\text{h}$ precipitation accumulations vs. critical empirical thresholds.
4. **Soil Moisture Saturation ($F_{\text{soil}}$)**: Volumetric soil water content ($\theta$).
5. **Historical Context ($F_{\text{hist}}$)**: Verified cataloged landslide frequency prior.

---

## 2. Mathematical Risk Formulation & Weight Specification

The final composite dynamic risk score $R \in [0.0, 1.0]$ is computed as:

$$R = \sum_{i} w_i F_i = w_{\text{static}} S_{\text{static}} + w_{\text{terrain}} F_{\text{terrain}} + w_{\text{rain}} F_{\text{rain}} + w_{\text{soil}} F_{\text{soil}} + w_{\text{hist}} F_{\text{hist}}$$

### Initial MVP Operational Weights
> **NOTE**: These weights represent initial operational defaults. They are NOT scientifically finalized empirical coefficients. Full calibration requires in-situ geotechnical telemetry and field observation.

| Contributing Factor | Factor Symbol | Initial Weight ($w_i$) | Physical Meaning | Normalization Formula |
| :--- | :--- | :--- | :--- | :--- |
| **Static ML Susceptibility** | $S_{\text{static}}$ | **0.35** | Long-term macro climatological landslide susceptibility | $P(\text{Presence}=1 \mid \text{Normals}) \in [0, 1]$ |
| **Terrain Gradient** | $F_{\text{terrain}}$ | **0.25** | Physical gravitational shear stress from slope & TRI | $0.70 \cdot \min(1, \text{Slope}/35^\circ) + 0.30 \cdot \min(1, \text{TRI}/25)$ |
| **Dynamic Rainfall** | $F_{\text{rain}}$ | **0.25** | Short-term storm downpour (24h) & antecedent saturation (72h) | $0.65 \cdot \min(1, P_{24}/150\text{mm}) + 0.35 \cdot \min(1, P_{72}/200\text{mm})$ |
| **Soil Moisture** | $F_{\text{soil}}$ | **0.10** | Pore water pressure indicator from ground sensors | $\text{Moisture}\% / 100 \in [0, 1]$ |
| **Historical Baseline** | $F_{\text{hist}}$ | **0.05** | Documented historical failure frequency | $\min(1, \text{Count} / 5)$ |

---

## 3. Dynamic Degraded Mode & Weight Normalization

When a physical data stream is unavailable (e.g. `terrain_coverage == False` or soil moisture sensor `MISSING`), the engine **does not fabricate fake observations**.

Instead:
1. The missing factor $F_k$ is set to `None`.
2. The remaining active weights are proportionally normalized:
   $$w_i' = \frac{w_i}{\sum_{j \in \text{active}} w_j}$$
3. The evaluation is explicitly flagged with `degraded_mode = True` and lists specific `degraded_reasons`.
4. Data freshness is explicitly tracked (`AVAILABLE`, `STALE`, `MISSING`, `SIMULATED`).

---

## 4. Severity Classification Mapping

Dynamic risk scores map directly onto the project's canonical severity tiers:

| Severity Tier | Risk Score Range | Visual Token | Operational Context |
| :--- | :--- | :--- | :--- |
| **LOW** | $0.00 \le R < 0.30$ | Green (`#16a34a`) | Background baseline stability; routine monitoring |
| **MODERATE** | $0.30 \le R < 0.60$ | Amber (`#d97706`) | Elevated precipitation or steep terrain; active observation |
| **HIGH** | $0.60 \le R < 0.80$ | Orange (`#ea580c`) | Threshold-exceeding rainfall + high susceptibility; heightened alert |
| **CRITICAL** | $0.80 \le R \le 1.00$ | Red (`#dc2626`) | Severe saturation + steep terrain + extreme storm downpour; critical response |

---

## 5. Audit-Ready Evidence Bundle Schema

Every dynamic evaluation generates a structured `RiskEvidenceBundle` answering:
*"Why did this zone receive this risk score?"*

```json
{
  "zone_id": "ZONE-GANGTOK-01",
  "evaluation": {
    "dynamic_risk_score": 0.74,
    "severity_level": "HIGH",
    "degraded_mode": true,
    "degraded_reasons": ["TERRAIN_DATA_UNAVAILABLE"],
    "contributing_factors": {
      "static_susceptibility": 0.75,
      "terrain_factor": null,
      "rainfall_factor": 0.72,
      "soil_moisture_factor": 0.85,
      "historical_context": 0.60
    },
    "data_freshness": {
      "terrain": "MISSING",
      "rainfall": "SIMULATED",
      "soil_moisture": "AVAILABLE"
    },
    "model_version": "lews-susceptibility-baseline-v1.0.0",
    "provenance": "SIMULATED",
    "scientific_disclaimer": "..."
  }
}
```

---

## 6. FastAPI Service Boundary Preparation

The domain models and engine are prepared for zero-overhead integration with FastAPI endpoints:
- `GET /api/v1/zones` $\rightarrow$ List of monitored zones with current severity
- `GET /api/v1/zones/{zone_id}` $\rightarrow$ Detailed zone profile
- `GET /api/v1/risk/current` $\rightarrow$ Real-time dynamic risk matrix
- `GET /api/v1/risk/{zone_id}` $\rightarrow$ Complete `RiskEvidenceBundle`
- `GET /api/v1/terrain/{zone_id}` $\rightarrow$ Zonal elevation, slope, TRI metrics
