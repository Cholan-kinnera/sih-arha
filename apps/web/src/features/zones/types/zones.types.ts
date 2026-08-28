import type { Zone, SeverityLevel, DataSourceType, Alert } from '../../../types/domain.types';

export interface ZoneDetailedProfile extends Zone {
  provenance: DataSourceType;
  rain_24h_mm: number;
  rain_72h_mm: number;
  soil_moisture_pct: number;
  drainage_basin: string;
  associated_aws_id?: string;
  associated_soil_probe_id?: string;
  active_alert?: Alert;
  historical_incidents_count: number;
}

export type ZoneSortOption =
  | 'RISK_DESC'
  | 'RISK_ASC'
  | 'SLOPE_DESC'
  | 'RAIN_24H_DESC'
  | 'NAME_ASC';

export interface ZoneFilterState {
  searchQuery: string;
  selectedSeverity: SeverityLevel | 'ALL';
  selectedDistrict: string | 'ALL';
  minRiskScore: number;
  minSlopeDegrees: number;
  sortBy: ZoneSortOption;
}

export interface ZonesSummaryMetrics {
  totalZonesCount: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  lowCount: number;
  avgRegionalRiskScore: number;
  max24hRainfallMm: number;
  max24hRainfallZoneName: string;
}
