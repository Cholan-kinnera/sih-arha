/**
 * Operational Alerts & Audit History API Endpoints
 */

import { fetchJson } from './client';
import { API_V1_PREFIX } from './config';
import type {
  AlertAcknowledgeRequest,
  AlertAuditResponse,
  AlertListResponse,
  AlertQueryParams,
  AlertResponse,
} from './types';

export async function getAlerts(params: AlertQueryParams = {}): Promise<AlertListResponse> {
  return fetchJson<AlertListResponse>(`${API_V1_PREFIX}/alerts`, {
    method: 'GET',
    params: {
      severity: params.severity,
      status: params.status,
      zone_id: params.zone_id,
      page: params.page,
      page_size: params.page_size,
    },
  });
}

export async function getAlertDetail(alertId: string): Promise<AlertResponse> {
  const cleanId = encodeURIComponent(alertId.trim());
  return fetchJson<AlertResponse>(`${API_V1_PREFIX}/alerts/${cleanId}`, {
    method: 'GET',
  });
}

export async function acknowledgeAlert(
  alertId: string,
  payload: AlertAcknowledgeRequest
): Promise<AlertResponse> {
  const cleanId = encodeURIComponent(alertId.trim());
  return fetchJson<AlertResponse>(`${API_V1_PREFIX}/alerts/${cleanId}/acknowledge`, {
    method: 'POST',
    body: payload,
  });
}

export async function getAlertAuditTrail(alertId: string): Promise<AlertAuditResponse[]> {
  const cleanId = encodeURIComponent(alertId.trim());
  return fetchJson<AlertAuditResponse[]>(`${API_V1_PREFIX}/alerts/${cleanId}/audit`, {
    method: 'GET',
  });
}
