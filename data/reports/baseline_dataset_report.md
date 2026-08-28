# LEWS — Baseline ML Dataset & Lineage Report

Generated automatically by `scripts/build_baseline_dataset.py`.

## 1. Executive Summary & Dimensions

- **Total Districts in Baseline**: 641
- **North-Eastern Region (NER) Districts**: 87
- **Non-NER Control Districts**: 554
- **Districts with Historical Landslides (Presence=1)**: 25 (15 in NER)
- **Total Landslide Events Mapped**: 40
- **Total Engineered Features**: 43

## 2. Feature Definitions & Formulas

| Column Name | Type | Physical Meaning / Formula | Provenance |
| :--- | :--- | :--- | :--- |
| `state` | String | Canonical Indian State / UT name | IMD / Census |
| `district` | String | Canonical District name | IMD / Census |
| `subdivision` | String | IMD Meteorological Subdivision | IMD |
| `is_ner` | Boolean | True for 8 North-Eastern States (Assam, AP, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura) | Geographic Standard |
| `annual_rainfall_normal_mm` | Float | Long-term annual normal precipitation (mm) | IMD Climatology |
| `monsoon_rainfall_normal_mm` | Float | June–September SW Monsoon normal precipitation (mm) | IMD Climatology |
| `pre_monsoon_rainfall_normal_mm` | Float | March–May Pre-Monsoon normal precipitation (mm) | IMD Climatology |
| `winter_rainfall_normal_mm` | Float | January–February Winter normal precipitation (mm) | IMD Climatology |
| `post_monsoon_rainfall_normal_mm` | Float | October–December Post-Monsoon normal precipitation (mm) | IMD Climatology |
| `monsoon_concentration_ratio` | Float | Proportion of annual rainfall during monsoon (Jun-Sep / Annual) | Engineered Ratio |
| `rainfall_seasonality_index` | Float | Walsh & Lawler (1981) Seasonality Index $\frac{1}{R}\sum |r_m - \frac{R}{12}|$ | Engineered Index |
| `peak_rainfall_month` | Integer | Month (1-12) with highest normal precipitation | Engineered Metric |
| `peak_month_rainfall_mm` | Float | Normal precipitation volume in peak month (mm) | IMD Climatology |
| `rainfall_variability_cv` | Float | Coefficient of variation across 12 monthly normals | Engineered Statistic |
| `subdivision_historical_mean_annual_mm` | Float | 115-year historical mean annual precipitation per subdivision (1901-2015) | IMD Time-Series |
| `subdivision_historical_std_annual_mm` | Float | 115-year standard deviation of annual precipitation per subdivision | IMD Time-Series |
| `subdivision_monsoon_mean_mm` | Float | 115-year historical mean monsoon precipitation per subdivision | IMD Time-Series |
| `historical_landslide_count` | Integer | **Ground-Truth Target**: Recorded historical landslide incidences in district | GSI Reports (2016-2020) |
| `historical_landslide_presence` | Binary (0/1) | **Ground-Truth Target**: 1 if `historical_landslide_count >= 1`, else 0 | Derived Binary Target |

## 3. Ground-Truth Target Label Methodology

- **Definition**: `historical_landslide_count` and `historical_landslide_presence` reflect verified historical landslide occurrences cataloged by the Geological Survey of India (2016–2020).
- **Scientific Caution**: This is a **spatial susceptibility and climatological exposure label**. It does NOT represent sub-daily event-trigger prediction, as sub-daily dynamic rainfall is not present in the historical normals dataset.

## 4. Leakage Prevention & Reproducibility

- **No Future Information**: Aggregations are strictly based on historical climatology (1901–2015) and static spatial definitions.
- **Deterministic Execution**: Output is 100% reproducible with zero stochastic or unseeded operations.

