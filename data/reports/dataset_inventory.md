# LEWS — Raw Dataset Master Inventory

Generated automatically by `scripts/inspect_data.py`.

| Dataset File | Type | Rows | Cols | Size (KB) | Status | Provenance | Intended Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `landslide_incidence.csv` | `.csv` | 63 | 3 | 33.4 | **ACCEPTED** | `HISTORICAL_REPORTS` | Baseline Landslide Ground-Truth Target Label |
| `rainfall_district.csv` | `.csv` | 641 | 19 | 67.7 | **ACCEPTED** | `CLIMATOLOGICAL_NORMALS` | District-Level Baseline Exposure & Seasonality Features |
| `rainfall_subdivision.csv` | `.csv` | 4116 | 19 | 515.7 | **ACCEPTED** | `HISTORICAL_TIME_SERIES` | Subdivision Climatological Baseline & Variance Features |

## Known Rejections & Geospatial Boundaries

- **`dem_s_1s_clip.tif`**: If present, rejected because extent (approx 139°E–149°E, 27°S–19°S) is outside North-Eastern India.
- **`plant_vase*.CSV`**: If present, classified as `EXPERIMENTAL / NON-NER SENSOR DATA` and isolated from baseline ML dataset.
