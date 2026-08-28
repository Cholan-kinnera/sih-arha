"""Feature Engineering Module for LEWS.

Derives non-leaking, scientifically grounded meteorological exposure &
seasonality features at the district and subdivision level.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Optional
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

MONTH_COLS = [
    "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
    "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
]


def calculate_seasonality_index(monthly_series: np.ndarray, annual_total: float) -> float:
    """Calculate Walsh & Lawler (1981) Rainfall Seasonality Index.

    SI = (1 / R) * sum(|x_n - R/12|)
    Where R is annual rainfall and x_n is monthly rainfall.
    Values range from <0.19 (spread throughout year) to >1.20 (extreme dry/wet regime).
    """
    if annual_total <= 0.0 or len(monthly_series) != 12:
        return 0.0
    mean_monthly = annual_total / 12.0
    abs_deviations = np.abs(monthly_series - mean_monthly)
    si = float(np.sum(abs_deviations) / annual_total)
    return round(si, 4)


def extract_district_rainfall_features(df_district_clean: pd.DataFrame) -> pd.DataFrame:
    """Derive district-level precipitation exposure, concentration, and seasonality features."""
    df = df_district_clean.copy()

    # Core rainfall metrics
    df["annual_rainfall_normal_mm"] = df["annual_mm"]
    df["monsoon_rainfall_normal_mm"] = df["monsoon_jun_sep_mm"]
    df["pre_monsoon_rainfall_normal_mm"] = df["pre_monsoon_mar_may_mm"]
    df["winter_rainfall_normal_mm"] = df["winter_jan_feb_mm"]
    df["post_monsoon_rainfall_normal_mm"] = df["post_monsoon_oct_dec_mm"]

    # Ratios (safe division)
    safe_annual = df["annual_rainfall_normal_mm"].replace(0.0, np.nan)
    df["monsoon_concentration_ratio"] = (
        (df["monsoon_rainfall_normal_mm"] / safe_annual).fillna(0.0).round(4)
    )
    df["pre_monsoon_concentration_ratio"] = (
        (df["pre_monsoon_rainfall_normal_mm"] / safe_annual).fillna(0.0).round(4)
    )

    # Monthly array calculations
    monthly_vals = df[MONTH_COLS].values
    annual_vals = df["annual_rainfall_normal_mm"].values

    seasonality_indices: List[float] = []
    peak_months: List[int] = []
    peak_month_rains: List[float] = []
    rainfall_cvs: List[float] = []

    for i in range(len(df)):
        m_row = monthly_vals[i]
        ann = annual_vals[i]

        si = calculate_seasonality_index(m_row, ann)
        seasonality_indices.append(si)

        peak_idx = int(np.argmax(m_row)) + 1  # 1-indexed month
        peak_months.append(peak_idx)
        peak_month_rains.append(float(m_row[peak_idx - 1]))

        mean_m = np.mean(m_row)
        std_m = np.std(m_row)
        cv = float(std_m / mean_m) if mean_m > 0.0 else 0.0
        rainfall_cvs.append(round(cv, 4))

    df["rainfall_seasonality_index"] = seasonality_indices
    df["peak_rainfall_month"] = peak_months
    df["peak_month_rainfall_mm"] = peak_month_rains
    df["rainfall_variability_cv"] = rainfall_cvs

    return df


def extract_subdivision_historical_features(df_subdivision_clean: pd.DataFrame) -> pd.DataFrame:
    """Aggregate 1901-2015 historical time-series per subdivision into baseline statistics."""
    df = df_subdivision_clean.copy()

    agg_df = (
        df.groupby("subdivision")
        .agg(
            subdivision_historical_mean_annual_mm=("annual_mm", "mean"),
            subdivision_historical_std_annual_mm=("annual_mm", "std"),
            subdivision_monsoon_mean_mm=("monsoon_jun_sep_mm", "mean"),
            subdivision_monsoon_std_mm=("monsoon_jun_sep_mm", "std"),
            subdivision_annual_min_mm=("annual_mm", "min"),
            subdivision_annual_max_mm=("annual_mm", "max"),
            subdivision_record_years_count=("year", "count"),
        )
        .reset_index()
    )

    # Round floats
    float_cols = [
        "subdivision_historical_mean_annual_mm",
        "subdivision_historical_std_annual_mm",
        "subdivision_monsoon_mean_mm",
        "subdivision_monsoon_std_mm",
        "subdivision_annual_min_mm",
        "subdivision_annual_max_mm",
    ]
    for c in float_cols:
        agg_df[c] = agg_df[c].round(2)

    return agg_df
