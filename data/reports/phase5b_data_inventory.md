# LEWS — Phase 5B Geospatial, Terrain & Telemetry Data Inventory

Generated automatically for **SIH26001 (Phase 5B)**.

---

## 1. Geospatial & Raster Datasets Status

| Raster Dataset | Expected Location | CRS | Resolution | Bounds | Status | Documented Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Copernicus / SRTM 30m DEM** | `data/raw/terrain/` or `data/raw/dem/` | EPSG:4326 / UTM 45N-46N | ~30m ($0.000277^\circ$) | North-East India ($[21.5^\circ\text{N}, 30.0^\circ\text{N}], [87.5^\circ\text{E}, 97.5^\circ\text{E}]$) | **ABSENT** | Pipeline operates in `TERRAIN_UNAVAILABLE` degraded mode. No fake elevation fabricated. |
| **Australia Clip DEM (`dem_s_1s_clip.tif`)** | `data/raw/rejected/` | EPSG:4326 | 1 arc-second | $139.5^\circ\text{E}–149.4^\circ\text{E}, 27.5^\circ\text{S}–19.6^\circ\text{S}$ | **REJECTED** | Incompatible Pacific/Australia coordinates. Quarantined in rejected directory. |

---

## 2. Tabular & Climatological Datasets

| Dataset File | Records | Primary Key | Provenance | Status | Usage in Phase 5B |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data/raw/landslide_incidence.csv` | 63 narrative reports | `incident_id` | GSI Historical Incidents (2016–2020) | **ACCEPTED** | Provides historical incident prior and spatial count validation. |
| `data/raw/rainfall_district.csv` | 641 districts | `(state, district)` | IMD Climatological Monthly Normals | **ACCEPTED** | Provides long-term climatological rainfall baseline for district zones. |
| `data/raw/rainfall_subdivision.csv` | 4,116 year-subdivision rows | `(subdivision, year)` | IMD 115-Year Historical Time-Series | **ACCEPTED** | Provides meteorological historical baseline statistics. |
| `data/processed/lews_baseline_dataset.parquet` | 641 rows (87 NER) | `(state, district)` | Cleaned & Verified Master Baseline | **ACCEPTED** | Source dataset for ML Susceptibility model inference. |

---

## 3. Dynamic Telemetry & Sensor Datasets

| Telemetry Stream | Frequency | Target Parameters | Current Source | Provenance Tag |
| :--- | :--- | :--- | :--- | :--- |
| **Dynamic Precipitation** | 15-min / 1-hour | $1\text{h}, 6\text{h}, 24\text{h}, 48\text{h}, 72\text{h}$ accumulation | Ingestion API / Test Simulator | `SIMULATED` (Test) / `LIVE` (Field) |
| **Volumetric Soil Moisture ($\theta$)** | Hourly | Soil saturation percentage ($0-100\%$) | Ingestion API / Test Simulator | `SIMULATED` (Test) / `LIVE` (Field) |
| **Plant Vase Experimental Sensors** | Timeseries | Experimental test sensors | `data/raw/experimental/` | `EXPERIMENTAL` (Isolated from ML) |

---

## 4. Scientific Limitation & Provenance Statement

- **Terrain Coverage**: Because verified 30m DEM GeoTIFF files are not yet mounted in `data/raw/terrain/`, the terrain feature pipeline explicitly flags `terrain_coverage = False` and the dynamic risk engine executes in a transparent degraded mode.
- **Simulator Policy**: Any generated test observations are strictly flagged `provenance = "SIMULATED"` and never merged into the historical baseline.
