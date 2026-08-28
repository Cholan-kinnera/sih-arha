import type { DataSourceType, SeverityLevel } from '../../../types/domain.types';

export interface TrajectoryDataPoint {
  timestamp: string;
  displayTime: string;
  regionalAverageRisk: number;
  peakZoneRisk: number;
  peakZoneName: string;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface CaineAnalyticalPoint {
  durationHours: number;
  thresholdIntensityMmPerHour: number;
  observedIntensityMmPerHour: number;
  cumulativeRainfallMm: number;
  isBreached: boolean;
}

export interface ZoneRiskComparisonPoint {
  zoneId: string;
  zoneName: string;
  district: string;
  riskScore: number;
  severity: SeverityLevel;
  slope: number;
  soilMoisturePct: number;
  rain24hMm: number;
  rain72hMm: number;
}

export interface SoilSlopeScatterPoint {
  zoneId: string;
  zoneName: string;
  slopeDegrees: number;
  soilMoisturePct: number;
  riskScore: number;
  severity: SeverityLevel;
}

export interface RainfallAccumulationPoint {
  zoneId: string;
  zoneName: string;
  rain24hMm: number;
  rain72hMm: number;
  severity: SeverityLevel;
}

export interface AnalyticsSummaryMetrics {
  regionalAvgRisk: number;
  peakRiskScore: number;
  peakRiskZone: string;
  max72hRainfallMm: number;
  max72hRainfallZone: string;
  zonesAboveWarningCount: number;
  zonesAboveCriticalCount: number;
  provenance: DataSourceType;
}

export type AnalyticsTimeRange = '24H' | '48H' | '72H';

export interface AnalyticsFilterState {
  timeRange: AnalyticsTimeRange;
  selectedBasin: string | 'ALL';
}
