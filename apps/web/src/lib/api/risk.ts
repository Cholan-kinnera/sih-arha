/**
 * Dynamic Risk Evaluation API Endpoints
 */

import { fetchJson } from './client';
import { API_V1_PREFIX } from './config';
import type {
  RiskEvaluationResponse,
  RiskMatrixResponse,
} from './types';

export async function getRiskMatrix(): Promise<RiskMatrixResponse> {
  return fetchJson<RiskMatrixResponse>(`${API_V1_PREFIX}/risk/current`, {
    method: 'GET',
  });
}

export async function getZoneRisk(zoneId: string): Promise<RiskEvaluationResponse> {
  const cleanId = encodeURIComponent(zoneId.trim());
  return fetchJson<RiskEvaluationResponse>(`${API_V1_PREFIX}/risk/${cleanId}`, {
    method: 'GET',
  });
}
