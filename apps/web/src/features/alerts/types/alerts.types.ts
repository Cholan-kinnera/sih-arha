import type { Alert, SeverityLevel, AlertStatus, DataSourceType } from '../../../types/domain.types';

export interface AlertAuditEntry {
  id: string;
  timestamp: string;
  action: 'GENERATED' | 'REVIEWED' | 'ACKNOWLEDGED' | 'DISPATCH_LOGGED' | 'RESOLVED';
  operator: string;
  notes?: string;
}

export interface AlertDetailed extends Alert {
  provenance: DataSourceType;
  basin_sector: string;
  district: string;
  state: string;
  trigger_metric: string;
  trigger_threshold_text: string;
  observed_value_text: string;
  rain_24h_mm: number;
  rain_72h_mm: number;
  soil_moisture_pct: number;
  slope: number;
  elevation: number;
  soil_type: string;
  audit_history: AlertAuditEntry[];
}

export interface AlertFilterState {
  searchQuery: string;
  selectedSeverity: SeverityLevel | 'ALL';
  selectedStatus: AlertStatus | 'ALL';
  timeWindow: 'ALL' | 'LAST_24H' | 'LAST_72H';
}

export interface AlertsSummaryMetrics {
  totalCount: number;
  activeCount: number;
  criticalCount: number;
  highCount: number;
  unacknowledgedCount: number;
  acknowledgedCount: number;
  last24hCount: number;
}
