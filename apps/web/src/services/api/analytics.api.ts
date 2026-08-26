import { apiClient } from './client';

export interface RainfallTrendPoint {
  timestamp: string;
  observed_mm: number;
  threshold_warning_mm: number;
  threshold_critical_mm: number;
}

export const analyticsApi = {
  getPrecipitationTrends: async (zoneId?: string): Promise<RainfallTrendPoint[]> => {
    return apiClient<RainfallTrendPoint[]>(`/analytics/precipitation${zoneId ? `?zone_id=${zoneId}` : ''}`);
  },
};
