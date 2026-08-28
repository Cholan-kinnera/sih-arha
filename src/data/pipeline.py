"""Master Baseline Dataset Assembly Pipeline for LEWS.

Joins cleaned district rainfall features, subdivision historical statistics,
and historical landslide ground-truth counts into reproducible baseline datasets:
- data/processed/lews_baseline_dataset.csv
- data/processed/lews_baseline_dataset.parquet
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional, Tuple
import pandas as pd

from src.data.cleaning import (
    clean_landslides,
    clean_rainfall_district,
    clean_rainfall_subdivision,
)
from src.data.feature_engineering import (
    extract_district_rainfall_features,
    extract_subdivision_historical_features,
)
from src.data.loaders import get_project_root

logger = logging.getLogger(__name__)


def build_baseline_dataset(
    output_dir: Optional[Path] = None,
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Execute the full data engineering pipeline and produce ML-ready baseline datasets."""
    root = output_dir or (get_project_root() / "data" / "processed")
    root.mkdir(parents=True, exist_ok=True)

    # 1. Clean individual sources
    logger.info("Executing clean_landslides...")
    df_ls = clean_landslides()

    logger.info("Executing clean_rainfall_district...")
    df_dist = clean_rainfall_district()

    logger.info("Executing clean_rainfall_subdivision...")
    df_sub = clean_rainfall_subdivision()

    # 2. Extract features
    logger.info("Extracting district rainfall features...")
    df_dist_feat = extract_district_rainfall_features(df_dist)

    logger.info("Extracting subdivision historical statistical features...")
    df_sub_feat = extract_subdivision_historical_features(df_sub)

    # 3. Aggregate historical landslide counts per (state, district)
    ls_valid = df_ls[(df_ls["state"] != "UNKNOWN") & (df_ls["district"] != "UNKNOWN")]
    ls_counts = (
        ls_valid.groupby(["state", "district"])
        .size()
        .reset_index(name="historical_landslide_count")
    )

    # 4. Merge district rainfall features with subdivision historical stats
    merged_features = pd.merge(
        df_dist_feat,
        df_sub_feat,
        on="subdivision",
        how="left",
    )

    # 5. Merge with historical landslide counts
    baseline_df = pd.merge(
        merged_features,
        ls_counts,
        on=["state", "district"],
        how="left",
    )

    # 6. Construct target labels
    baseline_df["historical_landslide_count"] = (
        baseline_df["historical_landslide_count"].fillna(0).astype(int)
    )
    baseline_df["historical_landslide_presence"] = (
        (baseline_df["historical_landslide_count"] >= 1).astype(int)
    )

    # Deduplicate in case of duplicate raw district entries
    before_dedup = len(baseline_df)
    baseline_df = baseline_df.drop_duplicates(subset=["state", "district"])
    after_dedup = len(baseline_df)
    if before_dedup != after_dedup:
        logger.warning(
            "Removed %d duplicate (state, district) rows from baseline",
            before_dedup - after_dedup,
        )

    # Sort deterministically
    baseline_df = baseline_df.sort_values(
        by=["is_ner", "state", "district"],
        ascending=[False, True, True],
    ).reset_index(drop=True)

    # 7. Write outputs
    csv_path = root / "lews_baseline_dataset.csv"
    baseline_df.to_csv(csv_path, index=False)
    logger.info("Wrote baseline CSV dataset (%d rows, %d cols) to %s", len(baseline_df), len(baseline_df.columns), csv_path)

    parquet_path = root / "lews_baseline_dataset.parquet"
    try:
        baseline_df.to_parquet(parquet_path, index=False)
        logger.info("Wrote baseline Parquet dataset to %s", parquet_path)
    except Exception as e:
        logger.warning("Could not write parquet (optional): %s", e)

    # Lineage and summary statistics
    metrics: Dict[str, Any] = {
        "total_districts": len(baseline_df),
        "ner_districts": int(baseline_df["is_ner"].sum()),
        "non_ner_districts": int((~baseline_df["is_ner"]).sum()),
        "positive_landslide_districts_total": int(baseline_df["historical_landslide_presence"].sum()),
        "positive_landslide_districts_ner": int(
            baseline_df[baseline_df["is_ner"]]["historical_landslide_presence"].sum()
        ),
        "total_landslide_incidents_mapped": int(baseline_df["historical_landslide_count"].sum()),
        "total_raw_landslide_records": len(df_ls),
        "total_columns": len(baseline_df.columns),
        "column_names": list(baseline_df.columns),
    }

    return baseline_df, metrics
