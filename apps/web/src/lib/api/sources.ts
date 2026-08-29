/**
 * Data Source Registry & Lineage API Endpoints
 */

import { fetchJson } from './client';
import { API_V1_PREFIX } from './config';
import type {
  DataSourceListResponse,
  DataSourceResponse,
} from './types';

export async function getDataSources(): Promise<DataSourceListResponse> {
  return fetchJson<DataSourceListResponse>(`${API_V1_PREFIX}/sources`, {
    method: 'GET',
  });
}

export async function getDataSourceDetail(sourceId: string): Promise<DataSourceResponse> {
  const cleanId = encodeURIComponent(sourceId.trim());
  return fetchJson<DataSourceResponse>(`${API_V1_PREFIX}/sources/${cleanId}`, {
    method: 'GET',
  });
}
