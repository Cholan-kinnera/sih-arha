#!/usr/bin/env python3
"""Main Training and Benchmarking Pipeline for LEWS ML Baseline Subsystem.

Executes spatial cross-validation, benchmarks baseline classifiers, selects
champion model, serializes versioned joblib bundle, and produces complete reports.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import platform
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# Ensure repository root is in pythonpath
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from ml.config import (
    ARTIFACTS_DIR,
    CANONICAL_FEATURE_COLUMNS,
    DEFAULT_DATASET_PATH,
    FEATURE_SCHEMA_VERSION,
    MODEL_NAME,
    MODEL_VERSION,
    RANDOM_STATE,
    REPORTS_DIR,
    RISK_SEVERITY_THRESHOLDS,
    SCIENTIFIC_DISCLAIMER,
)
from ml.features import create_preprocessor, extract_feature_matrix, validate_feature_schema
from ml.training.cross_validation import run_spatial_cross_validation
from ml.training.evaluate import (
    calculate_classification_metrics,
    evaluate_threshold_sweep,
    extract_feature_explanations,
)
from ml.validation import partition_ner_and_benchmark

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def compute_file_sha256(path: Path) -> str:
    """Compute SHA-256 hash of a file for exact dataset provenance."""
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def train_and_evaluate_all_models(
    dataset_path: Optional[Path] = None,
    output_dir: Optional[Path] = None,
    reports_dir: Optional[Path] = None,
    random_state: int = RANDOM_STATE,
) -> Dict[str, Any]:
    """Execute complete ML baseline training, validation, and benchmarking pipeline."""
    data_file = dataset_path or DEFAULT_DATASET_PATH
    artifacts_path = output_dir or ARTIFACTS_DIR
    reports_path = reports_dir or REPORTS_DIR

    artifacts_path.mkdir(parents=True, exist_ok=True)
    reports_path.mkdir(parents=True, exist_ok=True)

    logger.info("=" * 60)
    logger.info("LEWS ML BASELINE TRAINING PIPELINE START")
    logger.info("=" * 60)
    logger.info("Loading baseline dataset from: %s", data_file)

    if not data_file.exists():
        raise FileNotFoundError(f"Baseline dataset not found at {data_file}")

    dataset_hash = compute_file_sha256(data_file)
    df_raw = pd.read_parquet(data_file) if data_file.suffix == ".parquet" else pd.read_csv(data_file)

    # 1. Inspect and partition dataset
    ner_df, non_ner_df = partition_ner_and_benchmark(df_raw)

    # 2. Extract and validate feature matrix for NER primary dataset
    X_ner, y_ner, groups_ner = extract_feature_matrix(ner_df)
    feature_names = list(X_ner.columns)

    # Extract non-NER benchmark
    X_non_ner, y_non_ner, _ = extract_feature_matrix(non_ner_df, feature_cols=feature_names)

    ner_positives = int(y_ner.sum())
    ner_total = len(y_ner)
    logger.info(
        "NER Primary Dataset: %d districts, %d positive (%.2f%%), %d negative. States: %d",
        ner_total,
        ner_positives,
        (ner_positives / ner_total) * 100,
        ner_total - ner_positives,
        groups_ner.nunique(),
    )

    # 3. Define Model Factories
    model_factories = {
        "Logistic Regression (L2, Balanced)": lambda: Pipeline([
            ("preprocessor", create_preprocessor(feature_names, scale_numeric=True)),
            ("classifier", LogisticRegression(
                C=1.0,
                class_weight="balanced",
                max_iter=1000,
                random_state=random_state,
            )),
        ]),
        "Random Forest (Balanced, Depth=4)": lambda: Pipeline([
            ("preprocessor", create_preprocessor(feature_names, scale_numeric=False)),
            ("classifier", RandomForestClassifier(
                n_estimators=100,
                max_depth=4,
                min_samples_leaf=2,
                class_weight="balanced",
                random_state=random_state,
            )),
        ]),
        "HistGradientBoosting (Balanced)": lambda: Pipeline([
            ("preprocessor", create_preprocessor(feature_names, scale_numeric=False)),
            ("classifier", HistGradientBoostingClassifier(
                max_iter=100,
                min_samples_leaf=5,
                class_weight="balanced",
                random_state=random_state,
            )),
        ]),
    }

    # 4. Run Spatial Group Cross-Validation for each model
    cv_results: Dict[str, Any] = {}
    comparison_records: List[Dict[str, Any]] = []

    for name, factory in model_factories.items():
        logger.info("Running spatial GroupKFold cross-validation for: %s", name)
        res = run_spatial_cross_validation(
            pipeline_factory=factory,
            X=X_ner,
            y=y_ner,
            groups=groups_ner,
            n_splits=4,
            model_name=name,
        )
        cv_results[name] = res

        # Evaluate on Non-NER benchmark (fit on full NER, evaluate out-of-region)
        full_pipe = factory()
        full_pipe.fit(X_ner, y_ner)
        non_ner_probs = full_pipe.predict_proba(X_non_ner)[:, 1]
        non_ner_metrics = calculate_classification_metrics(y_non_ner.values, non_ner_probs)

        comparison_records.append({
            "model_name": name,
            "ner_oof_pr_auc": res["oof_metrics"]["pr_auc"],
            "ner_oof_roc_auc": res["oof_metrics"]["roc_auc"],
            "ner_oof_recall": res["oof_metrics"]["recall"],
            "ner_oof_precision": res["oof_metrics"]["precision"],
            "ner_oof_f1": res["oof_metrics"]["f1"],
            "ner_oof_balanced_accuracy": res["oof_metrics"]["balanced_accuracy"],
            "ner_oof_brier_score": res["oof_metrics"]["brier_score"],
            "ner_mean_pr_auc": res["mean_metrics"]["pr_auc"],
            "ner_std_pr_auc": res["std_metrics"]["pr_auc"],
            "ner_mean_roc_auc": res["mean_metrics"]["roc_auc"],
            "ner_std_roc_auc": res["std_metrics"]["roc_auc"],
            "non_ner_benchmark_pr_auc": non_ner_metrics["pr_auc"],
            "non_ner_benchmark_roc_auc": non_ner_metrics["roc_auc"],
        })

    comparison_df = pd.DataFrame(comparison_records)

    # 5. Champion Selection Rule:
    # Priority: 1. PR-AUC -> 2. Recall -> 3. F1 -> 4. ROC-AUC
    sorted_comparison = comparison_df.sort_values(
        by=["ner_oof_pr_auc", "ner_oof_recall", "ner_oof_f1", "ner_oof_roc_auc"],
        ascending=[False, False, False, False],
    ).reset_index(drop=True)

    champion_model_name = str(sorted_comparison.iloc[0]["model_name"])
    logger.info("Selected Champion Model based on validation criteria: %s", champion_model_name)

    # 6. Fit Final Champion Pipeline on Full NER Dataset & Extract Explanations
    champion_factory = model_factories[champion_model_name]
    champion_pipeline = champion_factory()
    champion_pipeline.fit(X_ner, y_ner)

    feature_explanations_df = extract_feature_explanations(
        champion_pipeline,
        feature_names,
        X=X_ner,
        y=y_ner,
    )

    # 7. Threshold Analysis on Champion OOF Predictions
    champion_oof_probs = cv_results[champion_model_name]["oof_probabilities"]
    threshold_df = evaluate_threshold_sweep(y_ner.values, champion_oof_probs)

    # 8. Persist Model Artifacts
    model_bundle_path = artifacts_path / "baseline_susceptibility_model.joblib"
    joblib.dump(champion_pipeline, model_bundle_path)
    logger.info("Saved champion model bundle to %s", model_bundle_path)

    metadata: Dict[str, Any] = {
        "model_name": MODEL_NAME,
        "model_version": MODEL_VERSION,
        "feature_schema_version": FEATURE_SCHEMA_VERSION,
        "champion_algorithm": champion_model_name,
        "training_timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "random_state": random_state,
        "dataset_filename": data_file.name,
        "dataset_sha256": dataset_hash,
        "total_dataset_rows": len(df_raw),
        "ner_sample_size": ner_total,
        "ner_positive_count": ner_positives,
        "ner_negative_count": ner_total - ner_positives,
        "ner_positive_rate": round(ner_positives / ner_total, 4),
        "non_ner_benchmark_rows": len(non_ner_df),
        "validation_strategy": "Spatial 4-Fold GroupKFold on State Grouping",
        "champion_oof_metrics": cv_results[champion_model_name]["oof_metrics"],
        "champion_fold_metrics": cv_results[champion_model_name]["fold_metrics"],
        "risk_severity_thresholds": RISK_SEVERITY_THRESHOLDS,
        "feature_count": len(feature_names),
        "features": feature_names,
        "environment": {
            "python_version": platform.python_version(),
            "scikit_learn_version": sklearn.__version__,
            "platform": platform.platform(),
        },
        "scientific_disclaimer": SCIENTIFIC_DISCLAIMER,
    }

    metadata_path = artifacts_path / "model_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    schema_info = {
        "feature_schema_version": FEATURE_SCHEMA_VERSION,
        "feature_names": feature_names,
        "target_name": "historical_landslide_presence",
        "data_types": {c: str(X_ner[c].dtype) for c in feature_names},
    }
    schema_path = artifacts_path / "feature_schema.json"
    with open(schema_path, "w", encoding="utf-8") as f:
        json.dump(schema_info, f, indent=2)

    # 9. Save CSV & JSON Reports
    comparison_csv_path = reports_path / "model_comparison.csv"
    sorted_comparison.to_csv(comparison_csv_path, index=False)

    threshold_csv_path = reports_path / "threshold_analysis.csv"
    threshold_df.to_csv(threshold_csv_path, index=False)

    feature_imp_csv_path = reports_path / "feature_importance.csv"
    feature_explanations_df.to_csv(feature_imp_csv_path, index=False)

    validation_json_path = reports_path / "validation_results.json"
    clean_cv_results = {}
    for m_name, m_data in cv_results.items():
        clean_cv_results[m_name] = {
            "mean_metrics": m_data["mean_metrics"],
            "std_metrics": m_data["std_metrics"],
            "oof_metrics": m_data["oof_metrics"],
            "fold_metrics": m_data["fold_metrics"],
            "cv_info": m_data["cv_info"],
        }
    with open(validation_json_path, "w", encoding="utf-8") as f:
        json.dump(clean_cv_results, f, indent=2)

    # 10. Generate Human-Readable Markdown Report
    report_md_path = reports_path / "baseline_ml_report.md"
    _generate_markdown_report(
        report_md_path=report_md_path,
        metadata=metadata,
        comparison_df=sorted_comparison,
        cv_results=cv_results,
        champion_model_name=champion_model_name,
        threshold_df=threshold_df,
        feature_explanations_df=feature_explanations_df,
    )
    logger.info("Saved baseline ML evaluation report to %s", report_md_path)

    return {
        "champion_model_name": champion_model_name,
        "champion_pipeline": champion_pipeline,
        "metadata": metadata,
        "comparison": sorted_comparison,
        "threshold_analysis": threshold_df,
        "feature_importance": feature_explanations_df,
    }


def _generate_markdown_report(
    report_md_path: Path,
    metadata: Dict[str, Any],
    comparison_df: pd.DataFrame,
    cv_results: Dict[str, Any],
    champion_model_name: str,
    threshold_df: pd.DataFrame,
    feature_explanations_df: pd.DataFrame,
) -> None:
    """Generate exhaustive, scientifically transparent Markdown evaluation report."""
    with open(report_md_path, "w", encoding="utf-8") as f:
        f.write("# LEWS — District-Level Historical Landslide Susceptibility ML Baseline Report\n\n")
        f.write(f"> **Model Version**: `{metadata['model_version']}` | **Training Date**: `{metadata['training_timestamp_utc']}`\n\n")

        f.write("## 1. Executive Summary & Scientific Boundary\n\n")
        f.write(f"{metadata['scientific_disclaimer']}\n\n")
        f.write(f"- **Champion Model Selected**: `{champion_model_name}`\n")
        f.write(f"- **Primary Validation Strategy**: Spatial 4-Fold `GroupKFold` grouped by Indian State.\n")
        f.write(f"- **Primary Target Region**: North-Eastern Region of India ($8$ States, {metadata['ner_sample_size']} Districts).\n")
        f.write(f"- **Class Distribution in NER**: {metadata['ner_positive_count']} Positive Districts ({metadata['ner_positive_rate']*100:.1f}%), {metadata['ner_negative_count']} Negative Districts.\n")
        f.write(f"- **Dataset SHA-256**: `{metadata['dataset_sha256']}`\n\n")

        f.write("## 2. Model Benchmarking & Validation Comparison\n\n")
        f.write("Models evaluated across Out-Of-Fold (OOF) spatial predictions on the NER target region:\n\n")
        f.write("| Model Architecture | NER OOF PR-AUC | NER OOF ROC-AUC | NER OOF Recall | NER OOF Precision | NER OOF F1 | Non-NER Benchmark PR-AUC |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
        for _, row in comparison_df.iterrows():
            f.write(
                f"| `{row['model_name']}` | **{row['ner_oof_pr_auc']:.4f}** | {row['ner_oof_roc_auc']:.4f} | "
                f"{row['ner_oof_recall']:.4f} | {row['ner_oof_precision']:.4f} | {row['ner_oof_f1']:.4f} | "
                f"{row['non_ner_benchmark_pr_auc']:.4f} |\n"
            )

        f.write("\n## 3. Spatial Cross-Validation Fold Breakdown (Champion Model)\n\n")
        champ_folds = cv_results[champion_model_name]["fold_metrics"]
        f.write("| Fold | Validation States | Val Samples | Positives | PR-AUC | ROC-AUC | Recall | Precision |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
        for fold in champ_folds:
            states_str = ", ".join(fold["validation_states"])
            f.write(
                f"| Fold {fold['fold']} | {states_str} | {fold['val_samples']} | {fold['val_positives']} | "
                f"{fold['pr_auc']:.4f} | {fold['roc_auc']:.4f} | {fold['recall']:.4f} | {fold['precision']:.4f} |\n"
            )

        f.write("\n## 4. Probability Classification Threshold Analysis\n\n")
        f.write("| Threshold | Flagged Districts | True Positives | False Positives | False Negatives | Precision | Recall | F1 Score |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
        for _, row in threshold_df.iterrows():
            f.write(
                f"| `{row['threshold']:.2f}` | {int(row['flagged_districts_count'])} | "
                f"{int(row['true_positives'])} | {int(row['false_positives'])} | {int(row['false_negatives'])} | "
                f"{row['precision']:.4f} | {row['recall']:.4f} | {row['f1']:.4f} |\n"
            )

        f.write("\n## 5. Feature Importance & Parameter Influence\n\n")
        f.write("| Feature Name | Importance Type | Score | Direction / Influence |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        for _, row in feature_explanations_df.head(15).iterrows():
            f.write(f"| `{row['feature_name']}` | `{row['importance_type']}` | {row['importance_score']:.4f} | `{row['influence_direction']}` |\n")

        f.write("\n## 6. Documented Limitations & Next Engineering Steps\n\n")
        f.write("1. **Absence of High-Resolution Terrain**: The current baseline does not ingest 30m DEM slope/curvature. Those layers will be added in Phase 5B.\n")
        f.write("2. **Climatological vs. Event Precipitation**: Features reflect long-term monthly precipitation normals and historical distribution, not 24h storm downpours.\n")
        f.write("3. **Small Positive Sample Size in NER**: With 15 positive districts across 8 NER states, cross-validation metrics exhibit variance across folds. Point estimates should be interpreted alongside standard deviations.\n\n")


def main() -> None:
    """CLI Entrypoint for baseline ML training."""
    parser = argparse.ArgumentParser(description="Train and evaluate LEWS Baseline ML Susceptibility Models")
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET_PATH, help="Path to input parquet/csv dataset")
    parser.add_argument("--output-dir", type=Path, default=ARTIFACTS_DIR, help="Directory to save model artifacts")
    parser.add_argument("--reports-dir", type=Path, default=REPORTS_DIR, help="Directory to save reports")
    parser.add_argument("--random-state", type=int, default=RANDOM_STATE, help="Random seed for reproducibility")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    train_and_evaluate_all_models(
        dataset_path=args.dataset,
        output_dir=args.output_dir,
        reports_dir=args.reports_dir,
        random_state=args.random_state,
    )


if __name__ == "__main__":
    main()
