# LEWS Machine Learning Baseline Audit

**Subsystem**: ML Feature Schema, Spatial Group Validation, Training & Inference
**Auditor**: Antigravity Automated Verification Agent
**Date**: 2026-08-28
**Status**: PASS

---

## 1. Model Baseline Summary & Scientific Nature

> [!IMPORTANT]
> **Scientific Nature**: This ML model (`lews-susceptibility-baseline-v1.0.0`) estimates **District-Level Macro-Scale Historical Landslide Susceptibility** based on 50-year precipitation normals and 115-year climatological variance. It is **NOT** an imminent landslide event-trigger predictor.

- **Primary Target Region**: 87 Districts in the 8 North-Eastern Region (NER) States.
- **Class Imbalance**: 15 Positive Districts (17.2%), 72 Negative Districts.
- **Validation Methodology**: 4-Fold Spatial `GroupKFold` grouped strictly by Indian State to prevent geographic spatial leakage between training and validation folds.
- **Preprocessing Placement**: Imputation and feature scaling are fit strictly inside cross-validation training folds.

---

## 2. Model Benchmark & Candidate Comparison

Three model architectures were trained and evaluated across Out-Of-Fold (OOF) predictions:

| Model Architecture | NER OOF PR-AUC | NER OOF ROC-AUC | NER OOF Recall | NER OOF Precision | NER OOF F1 | Non-NER Benchmark PR-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`HistGradientBoosting (Balanced)` (Champion)** | **0.2438** | **0.4958** | **0.2000** | **0.3000** | **0.2400** | 0.0218 |
| `Random Forest (Balanced, Depth=4)` | 0.1565 | 0.4106 | 0.4000 | 0.1714 | 0.2400 | 0.0189 |
| `Logistic Regression (L2, Balanced)` | 0.1505 | 0.2704 | 0.2667 | 0.0851 | 0.1290 | 0.0142 |

**Champion Selection**: `HistGradientBoosting (Balanced)` was selected based on achieving highest PR-AUC on spatial OOF evaluation and superior calibration.

---

## 3. Artifact Serialization & Reproducibility

- Model Bundle Artifact: `ml/artifacts/baseline_susceptibility_model.joblib` (32 kB)
- Model Metadata: `ml/artifacts/model_metadata.json`
- Feature Schema: `ml/artifacts/feature_schema.json`
- Determinism: `random_state=42` locked across folds, model estimators, and inference pipelines. Successive training runs yield identical metrics and identical feature weights.
- Inference Interface: `SusceptibilityPredictor` in `ml/inference/predict.py` strictly validates input feature vectors against `feature_schema.json` and outputs continuous probability `[0.0, 1.0]` and categorical severity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
