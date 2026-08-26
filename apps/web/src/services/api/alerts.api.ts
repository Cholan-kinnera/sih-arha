import { apiClient } from './client';
import type { Alert } from '../../types/domain.types';

export const alertsApi = {
  getAlerts: async (params?: { status?: string; severity?: string }): Promise<Alert[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.severity) query.set('severity', params.severity);
    const queryString = query.toString();
    return apiClient<Alert[]>(`/alerts${queryString ? `?${queryString}` : ''}`);
  },

  acknowledgeAlert: async (alertId: string, notes?: string): Promise<Alert> => {
    return apiClient<Alert>(`/alerts/${alertId}/ack`, {
      method: 'POST',
      body: JSON.stringify({ dispatch_notes: notes }),
    });
  },
};
