# LEWS — Geospatial Terrain Intelligence & Zonal Features Report

Generated automatically for **SIH26001 (Phase 5B)**.

- **Overall Terrain Status**: `AVAILABLE`
- **Total Districts Evaluated**: 641
- **Districts with Active DEM Coverage**: 641
- **North-Eastern Region Districts**: 87

## 1. Terrain Derivatives Mathematical Methodology

When high-resolution DEM rasters (e.g. Copernicus 30m) are ingested, the following algorithms are applied:

1. **Slope (Horn 1981 / Zevenbergen-Thorne 2nd Order Finite Difference)**:
   $$p = \frac{\partial z}{\partial x} = \frac{(z_{i+1, j-1} + 2z_{i+1, j} + z_{i+1, j+1}) - (z_{i-1, j-1} + 2z_{i-1, j} + z_{i-1, j+1})}{8 \Delta x}$$
   $$q = \frac{\partial z}{\partial y} = \frac{(z_{i-1, j+1} + 2z_{i, j+1} + z_{i+1, j+1}) - (z_{i-1, j-1} + 2z_{i, j-1} + z_{i+1, j-1})}{8 \Delta y}$$
   $$\text{Slope (degrees)} = \arctan\left(\sqrt{p^2 + q^2}\right) \cdot \frac{180}{\pi}$$

2. **Aspect (Direction of Maximum Gradient)**:
   $$\text{Aspect} = \text{atan2}(p, -q) \pmod{360^\circ}$$

3. **Terrain Roughness Index (Riley et al. 1999 TRI)**:
   $$\text{TRI} = \sqrt{\frac{1}{8} \sum_{k=1}^8 (z_k - z_0)^2}$$

## 2. Terrain Feature Schema & Integrity Policy

| Column Name | Type | Description | Nodata Policy |
| :--- | :--- | :--- | :--- |
| `state` | String | Canonical State name | Primary Key |
| `district` | String | Canonical District name | Primary Key |
| `is_ner` | Boolean | True for 8 NER states | Region Flag |
| `terrain_coverage` | Boolean | True if real DEM covers district | Strict Provenance Flag |
| `terrain_status` | String | `AVAILABLE` or `UNAVAILABLE` | Explicit Status |
| `mean_elevation_m` | Float | Zonal mean elevation (meters MSL) | `NaN` if DEM unavailable |
| `min_elevation_m` | Float | Zonal minimum elevation | `NaN` if DEM unavailable |
| `max_elevation_m` | Float | Zonal maximum elevation | `NaN` if DEM unavailable |
| `mean_slope_deg` | Float | Zonal mean slope in degrees | `NaN` if DEM unavailable |
| `max_slope_deg` | Float | Zonal maximum slope in degrees | `NaN` if DEM unavailable |
| `mean_tri` | Float | Zonal mean Terrain Roughness Index | `NaN` if DEM unavailable |
| `provenance` | String | Dataset source identifier | `TERRAIN_UNAVAILABLE` |

## 3. Degradation Policy

When `terrain_coverage == False`, the dynamic risk engine reallocates the terrain factor weight or marks the sub-factor degraded, ensuring no artificial confidence is conveyed.
