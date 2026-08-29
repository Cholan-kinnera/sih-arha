/**
 * Strict TypeScript Types matching FastAPI Backend Schemas
 */

export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ProvenanceType = 'LIVE' | 'HISTORICAL' | 'CLIMATOLOGICAL' | 'SIMULATED' | 'EXPERIMENTAL';

export type AlertStatusType = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export type SourceStatusType = 'CONNECTED' | 'DEGRADED' | 'STALE' | 'OFFLINE';

export type FreshnessType = 'FRESH' | 'AGING' | 'STALE' | 'OFFLINE';

// --- Zones ---
export interface TerrainSummary {
  terrain_coverage: boolean;
  terrain_status: string;
  mean_elevation_m?: number | null;
  mean_slope_deg?: number | null;
  mean_tri?: number | null;
  provenance: string;
}

export interface ZoneResponse {
  zone_id: string;
  name: string;
  state: string;
  district: string;
  subdivision: string;
  is_ner: boolean;
  latitude?: number | null;
  longitude?: number | null;
  historical_landslide_count: number;
  historical_landslide_presence: number;
}

export interface ZoneDetailResponse extends ZoneResponse {
  terrain?: TerrainSummary | null;
  static_susceptibility_prior?: number | null;
  current_dynamic_risk?: number | null;
  current_severity?: SeverityLevel | string | null;
  data_freshness?: string | null;
}

export interface ZoneListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  zones: ZoneResponse[];
}

export interface ZoneQueryParams {
  search?: string;
  state?: string;
  district?: string;
  is_ner?: boolean;
  page?: number;
  page_size?: number;
}

// --- Dynamic Risk ---
export interface RiskContributingFactorsSchema {
  static_susceptibility: number;
  terrain_factor?: number | null;
  rainfall_factor: number;
  soil_moisture_factor?: number | null;
  historical_context: number;
}

export interface RiskEvaluationResponse {
  zone_id: string;
  state: string;
  district: string;
  dynamic_risk_score: number;
  severity_level: SeverityLevel | string;
  degraded_mode: boolean;
  degraded_reasons: string[];
  contributing_factors: RiskContributingFactorsSchema;
  factor_weights_used: Record<string, number>;
  data_freshness: Record<string, string>;
  timestamp_utc: string;
  model_version: string;
  provenance: ProvenanceType | string;
  scientific_disclaimer: string;
}

export interface RiskMatrixResponse {
  timestamp_utc: string;
  total_zones: number;
  severity_distribution: Record<string, number>;
  evaluations: RiskEvaluationResponse[];
}

// --- Alerts ---
export interface AlertResponse {
  alert_id: string;
  zone_id: string;
  severity: SeverityLevel | string;
  risk_score: number;
  status: AlertStatusType | string;
  trigger_reason: string;
  provenance: ProvenanceType | string;
  created_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
}

export interface AlertListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  alerts: AlertResponse[];
}

export interface AlertQueryParams {
  severity?: string;
  status?: string;
  zone_id?: string;
  page?: number;
  page_size?: number;
}

export interface AlertAcknowledgeRequest {
  operator_id: string;
  notes: string;
}

export interface AlertAuditResponse {
  alert_id: string;
  action: string;
  operator_id: string;
  notes: string;
  timestamp_utc: string;
}

// --- Data Sources ---
export interface DataSourceResponse {
  source_id: string;
  name: string;
  provider: string;
  category: string;
  status: SourceStatusType | string;
  freshness: FreshnessType | string;
  provenance: ProvenanceType | string;
  cadence?: string | null;
  last_ingested_at?: string | null;
  record_count: number;
  metadata_json?: Record<string, unknown> | null;
}

export interface DataSourceListResponse {
  total: number;
  sources: DataSourceResponse[];
}

// --- Telemetry & WebSocket ---
export interface TelemetryIngestRequest {
  sensor_id: string;
  zone_id: string;
  timestamp_utc?: string;
  measurement_type: string;
  value: number;
  unit: string;
  provenance?: ProvenanceType | string;
  metadata_json?: Record<string, unknown> | null;
}

export interface TelemetryIngestResponse {
  status: string;
  sensor_id: string;
  zone_id: string;
  measurement_type: string;
  value: number;
  unit: string;
  provenance: string;
  zone_risk_updated: boolean;
  dynamic_risk_score?: number | null;
  severity_level?: string | null;
  alert_triggered: boolean;
  alert_id?: string | null;
}

export interface WebSocketTelemetryMessage {
  type: string;
  timestamp_utc: string;
  zone_id: string;
  sensor_id: string;
  measurement_type: string;
  value: number;
  unit: string;
  provenance: string;
  dynamic_risk_score?: number | null;
  severity_level?: SeverityLevel | string | null;
  alert_triggered?: boolean;
}

// --- Health ---
export interface HealthResponse {
  status: 'healthy' | 'degraded' | string;
  database: 'connected' | 'disconnected' | string;
  environment: string;
  version: string;
}
