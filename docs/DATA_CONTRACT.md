# Data Contract Specification

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

> **Notice**: These schemas represent conceptual data contracts and API Data Transfer Objects (DTOs) for system interoperability. Final database table DDL and migrations will be implemented in Phase 3.

---

## 1. Zone Contract

Represents a monitored geographical sector or hazard catchment area.

### Schema Fields
| Field Name | Type | Unit / Format | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID/slug) | Unique ID | Primary identifier (e.g., `zone-wayanad-north-01`) |
| `name` | `string` | Text | Human-readable zone name (e.g., `Meppadi Catchment North`) |
| `latitude` | `float` | Decimal degrees | Centroid latitude (-90.0 to 90.0) |
| `longitude` | `float` | Decimal degrees | Centroid longitude (-180.0 to 180.0) |
| `geometry` | `object` | GeoJSON Polygon | Geographic boundary coordinates |
| `slope` | `float` | Degrees (°) | Mean terrain slope angle ($0^\circ - 90^\circ$) |
| `elevation` | `float` | Meters (m) | Mean elevation above sea level |
| `soil_type` | `string` | Text | Primary soil classification (e.g., `Clayey Loam`, `Lateritic`) |

### JSON Example
```json
{
  "id": "zone-wayanad-north-01",
  "name": "Meppadi Catchment North",
  "latitude": 11.5524,
  "longitude": 76.1287,
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [76.1250, 11.5500],
        [76.1320, 11.5500],
        [76.1320, 11.5550],
        [76.1250, 11.5550],
        [76.1250, 11.5500]
      ]
    ]
  },
  "slope": 34.5,
  "elevation": 920.0,
  "soil_type": "Lateritic Red Soil"
}
```

---

## 2. SensorReading Contract

Represents an atomic environmental or telemetry observation for a specific zone.

### Schema Fields
| Field Name | Type | Unit / Format | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID) | Unique ID | Primary identifier |
| `zone_id` | `string` | Foreign Key | Associated zone identifier |
| `timestamp` | `string` | ISO 8601 UTC | Time of observation (`YYYY-MM-DDTHH:MM:SSZ`) |
| `rainfall_24h` | `float` | mm | Cumulative rainfall over the previous 24 hours |
| `rainfall_72h` | `float` | mm | Cumulative rainfall over the previous 72 hours |
| `soil_moisture`| `float` | % volumetric | Soil volumetric water content ($0.0\% - 100.0\%$) |
| `temperature`  | `float` | °C | Ambient surface temperature |
| `humidity`     | `float` | % | Ambient relative humidity ($0\% - 100\%$) |
| `source`       | `string` | Enum / Text | Origin of data: `"iot_sensor"`, `"imd_api"`, `"simulator"` |

### JSON Example
```json
{
  "id": "read-948f3e2b-7c1a-4d1a-8c10-2b1029384abc",
  "zone_id": "zone-wayanad-north-01",
  "timestamp": "2026-08-26T14:30:00Z",
  "rainfall_24h": 142.6,
  "rainfall_72h": 310.2,
  "soil_moisture": 86.4,
  "temperature": 21.5,
  "humidity": 94.0,
  "source": "simulator"
}
```

---

## 3. RiskScore Contract

Represents a calculated landslide hazard assessment output by the analytical engine.

### Schema Fields
| Field Name | Type | Unit / Format | Description |
| :--- | :--- | :--- | :--- |
| `zone_id` | `string` | Foreign Key | Evaluated zone identifier |
| `timestamp` | `string` | ISO 8601 UTC | Time of risk calculation |
| `score` | `float` | Continuous ($0.0 - 1.0$) | Overall normalized landslide hazard index |
| `severity` | `string` | Enum | Categorical level: `"LOW"`, `"MODERATE"`, `"HIGH"`, `"CRITICAL"` |
| `confidence` | `float` | Normalized ($0.0 - 1.0$) | Model confidence score |
| `drivers` | `object` | Key-Value pairs | Percentage / weight breakdown of risk contributors |
| `model_version` | `string` | Text | Identifier of active scoring engine / ML model |

### Severity Threshold Mapping
- `0.00 - 0.29`: **LOW** (Normal conditions, green alert)
- `0.30 - 0.59`: **MODERATE** (Advisory, amber alert)
- `0.60 - 0.79`: **HIGH** (Warning, orange alert, deploy monitoring)
- `0.80 - 1.00`: **CRITICAL** (Emergency, red alert, initiate evacuation protocol)

### JSON Example
```json
{
  "zone_id": "zone-wayanad-north-01",
  "timestamp": "2026-08-26T14:30:05Z",
  "score": 0.84,
  "severity": "CRITICAL",
  "confidence": 0.91,
  "drivers": {
    "rainfall_72h_saturation": 0.45,
    "slope_steepness": 0.30,
    "soil_moisture_level": 0.15,
    "geological_lithology": 0.10
  },
  "model_version": "heuristic-v1.2+xgb-ensemble"
}
```

---

## 4. Alert Contract

Represents a formal warning dispatch event triggered when safety thresholds are breached.

### Schema Fields
| Field Name | Type | Unit / Format | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID) | Unique ID | Primary identifier |
| `zone_id` | `string` | Foreign Key | Associated zone identifier |
| `timestamp` | `string` | ISO 8601 UTC | Time alert was created |
| `severity` | `string` | Enum | `"MODERATE"`, `"HIGH"`, `"CRITICAL"` |
| `risk_score` | `float` | Continuous ($0.0 - 1.0$) | Triggering risk index |
| `reason` | `string` | Text | Human-readable explanation of the trigger condition |
| `status` | `string` | Enum | `"ACTIVE"`, `"ACKNOWLEDGED"`, `"RESOLVED"` |
| `acknowledged_at`| `string` (nullable) | ISO 8601 UTC | Timestamp of operator acknowledgment (or `null`) |

### JSON Example
```json
{
  "id": "alt-b92c4f1a-3d2e-4a6f-998a-1c0987e456ba",
  "zone_id": "zone-wayanad-north-01",
  "timestamp": "2026-08-26T14:30:06Z",
  "severity": "CRITICAL",
  "risk_score": 0.84,
  "reason": "72h cumulative precipitation (310.2mm) and soil moisture (86.4%) exceeded critical failure threshold for slope >30°.",
  "status": "ACTIVE",
  "acknowledged_at": null
}
```
