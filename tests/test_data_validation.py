"""Unit Tests for Raw and Cleaned Data Validation."""

import pytest
import numpy as np
from src.data.loaders import (
    load_raw_landslides,
    load_raw_rainfall_district,
    load_raw_rainfall_subdivision,
)
from src.data.cleaning import (
    clean_landslides,
    clean_rainfall_district,
    clean_rainfall_subdivision,
)


def test_raw_loaders_load_data():
    df_ls = load_raw_landslides()
    assert len(df_ls) > 0
    assert "LandslideIncidence" in df_ls.columns

    df_dist = load_raw_rainfall_district()
    assert len(df_dist) > 0
    assert "STATE_UT_NAME" in df_dist.columns
    assert "DISTRICT" in df_dist.columns

    df_sub = load_raw_rainfall_subdivision()
    assert len(df_sub) > 0
    assert "SUBDIVISION" in df_sub.columns
    assert "YEAR" in df_sub.columns


def test_clean_landslides_structure_and_bounds():
    df_clean = clean_landslides()
    assert len(df_clean) > 0

    required_cols = {
        "incident_id", "state", "district", "latitude", "longitude",
        "is_ner", "coords_in_india", "coords_in_ner", "provenance",
    }
    assert required_cols.issubset(set(df_clean.columns))

    # Test coordinate validity where coordinates are present
    valid_coords = df_clean[df_clean["latitude"].notna()]
    assert len(valid_coords) > 0
    assert (valid_coords["latitude"] >= -90.0).all() and (valid_coords["latitude"] <= 90.0).all()
    assert (valid_coords["longitude"] >= -180.0).all() and (valid_coords["longitude"] <= 180.0).all()

    # Verify no fabricated coordinates
    null_coords = df_clean[df_clean["latitude"].isna()]
    assert null_coords["longitude"].isna().all()


def test_clean_rainfall_district_non_negative():
    df_dist = clean_rainfall_district()
    assert len(df_dist) == 641

    numeric_cols = [
        "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
        "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
        "annual_mm", "winter_jan_feb_mm", "pre_monsoon_mar_may_mm",
        "monsoon_jun_sep_mm", "post_monsoon_oct_dec_mm",
    ]

    for col in numeric_cols:
        assert (df_dist[col] >= 0.0).all(), f"Found negative values in {col}"

    assert df_dist["is_ner"].sum() == 87


def test_clean_rainfall_subdivision_temporal_integrity():
    df_sub = clean_rainfall_subdivision()
    assert len(df_sub) == 4116
    assert df_sub["year"].min() == 1901
    assert df_sub["year"].max() == 2015

    # Check zero nulls after median imputation
    assert df_sub["annual_mm"].isnull().sum() == 0
    assert (df_sub["annual_mm"] >= 0.0).all()
