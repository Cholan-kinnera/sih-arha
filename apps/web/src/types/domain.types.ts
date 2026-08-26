/**
 * Domain types for Landslide Early Warning & Risk Monitoring (LEWS)
 * Authoritative contracts: docs/DATA_CONTRACT.md & docs/PRODUCT_REQUIREMENTS.md
 */

export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataSourceType = 'REAL-WORLD' | 'HISTORICAL' | 'DERIVED' | 'SIMULATED';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Zone {
  id: string;
  name: string;
  district?: string;
  state?: string;
  latitude: number;
  longitude: number;
  geometry: GeoPolygon;
  slope: number; // Slope in degrees
  elevation: number; // Elevation in meters
  soil_type: string;
  current_risk_score?: number;
  current_severity?: SeverityLevel;
  last_updated?: string;
}

export interface SensorReading {
  id: string;
  zone_id: string;
  timestamp: string;
  rainfall_24h: number; // mm
  rainfall_72h: number; // mm
  soil_moisture: number; // Volumetric % (0-100)
  temperature: number; // Celsius
  humidity: number; // % (0-100)
  source: string; // "iot_sensor" | "imd_api" | "simulator"
}

export interface RiskDriver {
  factor: string;
  contribution_pct: number; // Percentage 0 - 100
  description?: string;
}

export interface RiskScore {
  zone_id: string;
  timestamp: string;
  score: number; // Continuous 0.0 - 1.0
  severity: SeverityLevel;
  confidence: number; // 0.0 - 1.0
  drivers: Record<string, number> | RiskDriver[];
  model_version: string;
}

export interface Alert {
  id: string;
  zone_id: string;
  zone_name?: string;
  timestamp: string;
  severity: SeverityLevel;
  risk_score: number;
  reason: string;
  status: AlertStatus;
  acknowledged_at: string | null;
  acknowledged_by?: string | null;
  dispatch_notes?: string | null;
}

export interface HistoricalIncident {
  id: string;
  zone_id: string;
  year: number;
  date?: string;
  incident_type: string; // e.g. "Debris Flow", "Rotational Slide"
  trigger_rainfall_mm?: number;
  casualties?: number;
  proximity_m: number;
  description?: string;
}

export interface DataSource {
  id: string;
  source_name: string;
  provider: string;
  dataset_name: string;
  data_type: DataSourceType;
  spatial_coverage: string;
  resolution: string;
  coordinate_system: string;
  update_frequency: string;
  status: 'CONNECTED' | 'CACHED' | 'OFFLINE' | 'SIMULATOR';
  last_sync_timestamp: string;
  known_limitations: string;
}

export interface ModelFeatureWeight {
  feature_name: string;
  weight: number;
  category: 'Dynamic Meteorological' | 'Static Topographic' | 'Dynamic Geotechnical' | 'Static Spatial';
}

export interface ModelMetadata {
  model_id: string;
  name: string;
  version: string;
  model_type: 'Heuristic Deterministic' | 'Random Forest Classifier' | 'XGBoost Ensembled';
  status: 'OPERATIONAL_BASELINE' | 'EXPERIMENTAL';
  feature_weights: ModelFeatureWeight[];
  validation_metrics?: {
    roc_auc: number;
    precision: number;
    recall: number;
  };
  disclaimer: string;
}
