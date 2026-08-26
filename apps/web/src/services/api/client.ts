import { envConfig } from '../../config/env.config';
import type { ApiResponse } from '../../types/api.types';

export class ApiError extends Error {
  status: number;
  details?: Record<string, unknown>;

  constructor(
    status: number,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Base HTTP client for LEWS FastAPI backend
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${envConfig.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      let errorDetails: Record<string, unknown> | undefined;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.detail || errorJson.message || errorMessage;
        errorDetails = errorJson;
      } catch {
        // Fallback to generic message if response not JSON
      }
      throw new ApiError(response.status, errorMessage, errorDetails);
    }

    const data: ApiResponse<T> | T = await response.json();
    return (data as ApiResponse<T>).data !== undefined ? (data as ApiResponse<T>).data : (data as T);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out');
    }
    throw new ApiError(500, error instanceof Error ? error.message : 'Network error');
  } finally {
    clearTimeout(timeoutId);
  }
}
