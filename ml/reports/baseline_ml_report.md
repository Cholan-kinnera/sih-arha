# LEWS — District-Level Historical Landslide Susceptibility ML Baseline Report

> **Model Version**: `lews-susceptibility-baseline-v1.0.0` | **Training Date**: `2026-08-28T17:26:21.943746+00:00`

## 1. Executive Summary & Scientific Boundary

DISCLAIMER: This model estimates district-level historical landslide susceptibility based on long-term climatological rainfall normals and historical patterns. It is NOT a real-time or event-trigger prediction system and does not predict specific landslide occurrences on given dates.

- **Champion Model Selected**: `HistGradientBoosting (Balanced)`
- **Primary Validation Strategy**: Spatial 4-Fold `GroupKFold` grouped by Indian State.
- **Primary Target Region**: North-Eastern Region of India ($8$ States, 87 Districts).
- **Class Distribution in NER**: 15 Positive Districts (17.2%), 72 Negative Districts.
- **Dataset SHA-256**: `5ed09d8b62e2faddee697c5859cfffd0a980ee734c18111ca712b4eda3838777`

## 2. Model Benchmarking & Validation Comparison

Models evaluated across Out-Of-Fold (OOF) spatial predictions on the NER target region:

| Model Architecture | NER OOF PR-AUC | NER OOF ROC-AUC | NER OOF Recall | NER OOF Precision | NER OOF F1 | Non-NER Benchmark PR-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `HistGradientBoosting (Balanced)` | **0.2438** | 0.4958 | 0.2000 | 0.3000 | 0.2400 | 0.0218 |
| `Random Forest (Balanced, Depth=4)` | **0.1565** | 0.4106 | 0.4000 | 0.1714 | 0.2400 | 0.0189 |
| `Logistic Regression (L2, Balanced)` | **0.1505** | 0.2704 | 0.2667 | 0.0851 | 0.1290 | 0.0142 |

## 3. Spatial Cross-Validation Fold Breakdown (Champion Model)

| Fold | Validation States | Val Samples | Positives | PR-AUC | ROC-AUC | Recall | Precision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Fold 1 | ASSAM | 27 | 2 | 0.1339 | 0.6100 | 0.0000 | 0.0000 |
| Fold 2 | ARUNACHAL PRADESH, TRIPURA | 20 | 2 | 0.6429 | 0.8611 | 0.5000 | 1.0000 |
| Fold 3 | MEGHALAYA, NAGALAND, SIKKIM | 22 | 7 | 0.4254 | 0.5048 | 0.2857 | 0.5000 |
| Fold 4 | MANIPUR, MIZORAM | 18 | 4 | 0.2070 | 0.2857 | 0.0000 | 0.0000 |

## 4. Probability Classification Threshold Analysis

| Threshold | Flagged Districts | True Positives | False Positives | False Negatives | Precision | Recall | F1 Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `0.20` | 19 | 5 | 14 | 10 | 0.2632 | 0.3333 | 0.2941 |
| `0.30` | 16 | 4 | 12 | 11 | 0.2500 | 0.2667 | 0.2581 |
| `0.40` | 14 | 3 | 11 | 12 | 0.2143 | 0.2000 | 0.2069 |
| `0.50` | 10 | 3 | 7 | 12 | 0.3000 | 0.2000 | 0.2400 |
| `0.60` | 10 | 3 | 7 | 12 | 0.3000 | 0.2000 | 0.2400 |
| `0.70` | 9 | 3 | 6 | 12 | 0.3333 | 0.2000 | 0.2500 |
| `0.80` | 6 | 2 | 4 | 13 | 0.3333 | 0.1333 | 0.1905 |

## 5. Feature Importance & Parameter Influence

| Feature Name | Importance Type | Score | Direction / Influence |
| :--- | :--- | :--- | :--- |
| `rainfall_seasonality_index` | `permutation_importance` | 0.1506 | `NON_LINEAR_CONTRIBUTION` |
| `dec_mm` | `permutation_importance` | 0.0103 | `NON_LINEAR_CONTRIBUTION` |
| `oct_mm` | `permutation_importance` | 0.0011 | `NON_LINEAR_CONTRIBUTION` |
| `winter_rainfall_normal_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `pre_monsoon_rainfall_normal_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `jan_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `peak_rainfall_month` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `subdivision_monsoon_std_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `subdivision_monsoon_mean_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `jun_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `sep_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `post_monsoon_rainfall_normal_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `monsoon_rainfall_normal_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `subdivision_annual_min_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |
| `subdivision_annual_max_mm` | `permutation_importance` | 0.0000 | `NON_LINEAR_CONTRIBUTION` |

## 6. Documented Limitations & Next Engineering Steps

1. **Absence of High-Resolution Terrain**: The current baseline does not ingest 30m DEM slope/curvature. Those layers will be added in Phase 5B.
2. **Climatological vs. Event Precipitation**: Features reflect long-term monthly precipitation normals and historical distribution, not 24h storm downpours.
3. **Small Positive Sample Size in NER**: With 15 positive districts across 8 NER states, cross-validation metrics exhibit variance across folds. Point estimates should be interpreted alongside standard deviations.

