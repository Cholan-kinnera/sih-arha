# LEWS Raw Data Integrity Audit

**Subsystem**: Raw Dataset Inventory, Validation & Provenance
**Auditor**: Antigravity Automated Verification Agent
**Date**: 2026-08-28
**Status**: PASS

---

## 1. Raw Dataset Inventory & Physical Inspection

All raw datasets located in `data/raw/` were physically inspected for encoding, schema, row count, nullability, and geographic validity:

| Dataset File | Format | Rows | Cols | Provenance | Coverage | Pipeline Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `landslide_incidence.csv` | CSV (UTF-8) | 63 | 12 | GSI (Geological Survey of India) Reports (2016–2020) | All-India (40 verified mapped events, 15 in NER) | **Primary Ground-Truth Target Label** |
| `rainfall_district.csv` | CSV (UTF-8) | 641 | 19 | IMD (India Meteorological Department) Normal Rainfall (1951–2000) | All-India 641 Districts (87 NER, 554 Benchmark) | **Primary District Climatology Features** |
| `rainfall_subdivision.csv` | CSV (UTF-8) | 4,116 | 19 | IMD 115-Year Subdivision Time-Series (1901–2015) | 36 IMD Meteorological Subdivisions | **Historical Macro-Variability Features** |

---

## 2. Detailed Dataset Findings

### A. `landslide_incidence.csv`
- **Integrity**: 63 raw records. After spatial coordinate normalization and duplicate resolution, 40 distinct historical landslide locations are verified.
- **Geographic Representation**: 25 districts with verified historical landslide presence (15 in NER, 10 in non-NER benchmark mountain districts like Wayanad and Nilgiris).
- **Caveat**: GSI dataset represents cataloged historical events; it is not an exhaustive real-time inventory.

### B. `rainfall_district.csv`
- **Integrity**: 641 unique district records. Zero missing values across all 12 monthly precipitation normals (`JAN` through `DEC`) and seasonal aggregates (`ANNUAL`, `MONSOON`, `PRE_MONSOON`, `POST_MONSOON`, `WINTER`).
- **Validation**: All precipitation values are strictly non-negative ($v \ge 0.0$ mm).
- **District Key Alignment**: 100% of the 87 NER districts in canonical administrative references map accurately to IMD normals.

### C. `rainfall_subdivision.csv`
- **Integrity**: 4,116 temporal records covering 1901–2015 across 36 meteorological subdivisions.
- **Validation**: Strict temporal monotonicity and non-negative rainfall verified across 115 years.

---

## 3. Immutability & Future Data Status

- **Raw Data Immutability**: All scripts in `src/data/` treat `data/raw/` as read-only.
- **Unmounted High-Resolution DEM Rasters**: `data/raw/dem/` currently contains no 30m GeoTIFF rasters. The pipeline gracefully handles this absence by setting `terrain_coverage=false` and `mean_slope_deg=NULL`.
- **Experimental IoT Telemetry**: `data/raw/experimental/` is isolated from the baseline ML training pipeline to prevent experimental contamination.
