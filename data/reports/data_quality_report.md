# LEWS — Comprehensive Data Quality & Profiling Report

Generated automatically by `scripts/inspect_data.py`.

## Dataset: `landslide_incidence`

- **Path**: `data/raw/landslide_incidence.csv`
- **Dimensions**: 63 rows × 3 columns
- **Duplicates**: 0
- **Provenance**: GSI Historical Incidents (2016-2020)
- **Documented Scientific Limitation**: Text-based narratives require parsing for date, coordinates, state, and district.

### Missing Values by Column

| Column | Missing Count |
| :--- | :--- |
| `Unnamed: 0` | 0 |
| `Title` | 1 |
| `LandslideIncidence` | 0 |

---

## Dataset: `rainfall_district`

- **Path**: `data/raw/rainfall_district.csv`
- **Dimensions**: 641 rows × 19 columns
- **Duplicates**: 0
- **Provenance**: IMD District-Wise Climatological Rainfall Normals
- **Documented Scientific Limitation**: Represents long-term climatological normal precipitation, not event-specific trigger downpours.

### Missing Values by Column

| Column | Missing Count |
| :--- | :--- |
| `STATE_UT_NAME` | 0 |
| `DISTRICT` | 0 |
| `JAN` | 0 |
| `FEB` | 0 |
| `MAR` | 0 |
| `APR` | 0 |
| `MAY` | 0 |
| `JUN` | 0 |
| `JUL` | 0 |
| `AUG` | 0 |
| `SEP` | 0 |
| `OCT` | 0 |
| `NOV` | 0 |
| `DEC` | 0 |
| `ANNUAL` | 0 |
| `Jan-Feb` | 0 |
| `Mar-May` | 0 |
| `Jun-Sep` | 0 |
| `Oct-Dec` | 0 |

---

## Dataset: `rainfall_subdivision`

- **Path**: `data/raw/rainfall_subdivision.csv`
- **Dimensions**: 4116 rows × 19 columns
- **Duplicates**: 0
- **Provenance**: IMD Subdivision-Wise Historical Rainfall Time-Series (1901-2015)
- **Documented Scientific Limitation**: Broad spatial meteorological aggregation covering multiple districts.

### Missing Values by Column

| Column | Missing Count |
| :--- | :--- |
| `SUBDIVISION` | 0 |
| `YEAR` | 0 |
| `JAN` | 4 |
| `FEB` | 3 |
| `MAR` | 6 |
| `APR` | 4 |
| `MAY` | 3 |
| `JUN` | 5 |
| `JUL` | 7 |
| `AUG` | 4 |
| `SEP` | 6 |
| `OCT` | 7 |
| `NOV` | 11 |
| `DEC` | 10 |
| `ANNUAL` | 26 |
| `Jan-Feb` | 6 |
| `Mar-May` | 9 |
| `Jun-Sep` | 10 |
| `Oct-Dec` | 13 |

---

