"""Tests for Experimental Sensor Data Isolation."""

import pytest
from pathlib import Path
import pandas as pd
from src.data.experimental_sensors import process_experimental_sensors


def test_experimental_sensor_isolation(tmp_path):
    # Test handling when no experimental files exist
    empty_dir = tmp_path / "empty_exp"
    empty_dir.mkdir()

    res = process_experimental_sensors(raw_dir=empty_dir, output_dir=tmp_path)
    assert res is None

    # Test processing dummy plant_vase file
    fake_csv = empty_dir / "plant_vase1.CSV"
    fake_csv.write_text("year,month,day,hour,minute,second,moisture0,moisture1,irrgation\n2026,8,28,12,0,0,45.2,46.1,0\n")

    res_df = process_experimental_sensors(raw_dir=empty_dir, output_dir=tmp_path)
    assert res_df is not None
    assert len(res_df) == 1
    assert res_df["provenance"].iloc[0] == "EXPERIMENTAL"
    assert res_df["geography_context"].iloc[0] == "UNKNOWN_NON_NER_LABORATORY"
