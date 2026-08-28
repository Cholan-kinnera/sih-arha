"""Unit Tests for Zonal Terrain Features Extraction Pipeline."""

import pytest
import numpy as np
import pandas as pd
from src.geospatial.zonal import extract_zonal_terrain_features
from src.geospatial.raster import DEMRaster


def test_zonal_features_unavailable_dem_pipeline(tmp_path):
    # Running extraction without DEM data
    df, meta = extract_zonal_terrain_features(dem=None, output_dir=tmp_path)

    assert len(df) == 641
    assert meta["status"] == "UNAVAILABLE"
    assert meta["covered_districts"] == 0

    # Verify no fake numbers fabricated
    assert (df["terrain_coverage"] == False).all()
    assert (df["terrain_status"] == "UNAVAILABLE").all()
    assert df["mean_elevation_m"].isnull().all()
    assert df["mean_slope_deg"].isnull().all()

    # Verify zero duplicate keys
    assert df.duplicated(subset=["state", "district"]).sum() == 0


def test_zonal_features_with_valid_dem(tmp_path):
    # Create a synthetic 10x10 DEM raster for Gangtok (27.33 N, 88.61 E)
    data = np.linspace(1000.0, 2500.0, 100).reshape((10, 10))
    bounds = (88.5, 27.2, 88.7, 27.4)  # within NER
    dem_obj = DEMRaster(data=data, bounds=bounds, crs="EPSG:4326")

    df, meta = extract_zonal_terrain_features(dem=dem_obj, output_dir=tmp_path)

    assert meta["status"] == "AVAILABLE"
    assert (df["terrain_coverage"] == True).all()
    assert df["mean_elevation_m"].notnull().all()
    assert df["mean_slope_deg"].notnull().all()
    assert (df["mean_slope_deg"] >= 0.0).all()
