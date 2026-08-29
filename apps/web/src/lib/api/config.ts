/**
 * API Client Configuration & Environment Settings
 */

const getApiBaseUrl = (): string => {
  // Read Vite environment variable or fall back to local dev server
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : undefined;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_V1_PREFIX = '/api/v1';

export const getWebSocketUrl = (endpoint: string = '/api/v1/ws/telemetry'): string => {
  const base = API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (base.startsWith('https://')) {
    return base.replace('https://', 'wss://') + cleanEndpoint;
  }
  if (base.startsWith('http://')) {
    return base.replace('http://', 'ws://') + cleanEndpoint;
  }
  return `ws://127.0.0.1:8000${cleanEndpoint}`;
};

export const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
