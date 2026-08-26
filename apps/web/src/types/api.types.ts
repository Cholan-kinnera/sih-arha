/**
 * API contracts and DTO types for LEWS backend
 */

import type { Alert, Zone } from './domain.types';

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface OverviewSummary {
  total_monitored_zones: number;
  regional_avg_risk: number;
  active_critical_alerts: number;
  active_high_alerts: number;
  peak_rainfall_24h_mm: number;
  top_at_risk_zones: Zone[];
  recent_alerts: Alert[];
  last_updated_timestamp: string;
}
