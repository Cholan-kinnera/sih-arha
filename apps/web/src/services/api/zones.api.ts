import { apiClient } from './client';
import type { Zone, SensorReading, RiskScore } from '../../types/domain.types';

export const zonesApi = {
  getZones: async (): Promise<Zone[]> => {
    return apiClient<Zone[]>('/zones');
  },

  getZoneById: async (zoneId: string): Promise<Zone> => {
    return apiClient<Zone>(`/zones/${zoneId}`);
  },

  getZoneTelemetry: async (zoneId: string): Promise<SensorReading[]> => {
    return apiClient<SensorReading[]>(`/zones/${zoneId}/readings`);
  },

  getZoneRiskScore: async (zoneId: string): Promise<RiskScore> => {
    return apiClient<RiskScore>(`/zones/${zoneId}/risk`);
  },
};
