import type { Zone, Alert, SeverityLevel } from '../../../types/domain.types';

export interface OverviewKpiData {
  monitoredZonesCount: number;
  regionalRiskScore: number;
  regionalSeverity: SeverityLevel;
  regionalRiskTrendText: string;
  criticalAlertsCount: number;
  unacknowledgedAlertsCount: number;
  peakRainfall24h: number;
  peakRainfallZoneName: string;
}

export interface RiskTrendDataPoint {
  timeLabel: string;
  timestamp: string;
  regionalRisk: number;
  peakZoneRisk: number;
  thresholdWarning: number;
  thresholdCritical: number;
}

export interface OverviewDashboardData {
  kpis: OverviewKpiData;
  zones: Zone[];
  alerts: Alert[];
  riskTrend: RiskTrendDataPoint[];
  lastUpdatedTimestamp: string;
  provenance: 'SIMULATED';
  activeTelemetryNodesCount: number;
  totalDataSourcesCount: number;
}
