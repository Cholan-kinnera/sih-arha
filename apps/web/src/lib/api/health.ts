/**
 * Service & Database Health Check API Endpoint
 */

import { fetchJson } from './client';
import type { HealthResponse } from './types';

export async function getHealthStatus(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>('/health', {
    method: 'GET',
    timeoutMs: 5000,
  });
}
