"""Experimental Sensor Data Isolation & Processing Module for LEWS.

Handles non-NER experimental sensor / plant vase telemetry datasets
strictly in isolation from the production landslide ML dataset.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import List, Optional
import pandas as pd

from src.data.loaders import get_project_root

logger = logging.getLogger(__name__)


def process_experimental_sensors(
    raw_dir: Optional[Path] = None,
    output_dir: Optional[Path] = None,
) -> Optional[pd.DataFrame]:
    """Process experimental sensor files and output isolated timeseries dataset."""
    root = get_project_root()
    input_dir = raw_dir or (root / "data" / "raw" / "experimental")
    out_dir = output_dir or (root / "data" / "processed")
    out_dir.mkdir(parents=True, exist_ok=True)

    csv_files = list(input_dir.glob("*.csv")) + list(input_dir.glob("*.CSV"))

    if not csv_files:
        logger.info("No experimental sensor files found in %s", input_dir)
        return None

    dfs: List[pd.DataFrame] = []
    for f in sorted(csv_files):
        try:
            df = pd.read_csv(f)
            df["source_file"] = f.name
            dfs.append(df)
            logger.info("Loaded experimental sensor dataset: %s (%d rows)", f.name, len(df))
        except Exception as e:
            logger.warning("Could not read experimental sensor file %s: %s", f, e)

    if not dfs:
        return None

    combined_df = pd.concat(dfs, ignore_index=True)

    # Standardize metadata flags
    combined_df["provenance"] = "EXPERIMENTAL"
    combined_df["geography_context"] = "UNKNOWN_NON_NER_LABORATORY"
    combined_df["intended_use"] = "TELEMETRY_PIPELINE_AND_SIMULATOR_TESTING"

    out_file = out_dir / "experimental_sensor_timeseries.csv"
    combined_df.to_csv(out_file, index=False)
    logger.info("Saved %d experimental sensor rows to %s", len(combined_df), out_file)

    return combined_df
