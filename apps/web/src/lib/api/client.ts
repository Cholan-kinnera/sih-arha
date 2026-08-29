/**
 * Core HTTP Fetch Client with Timeout, Error Wrapping & TypeScript Generics
 */

import { API_BASE_URL, DEFAULT_REQUEST_TIMEOUT_MS } from './config';
import { ApiError } from './errors';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

export async function fetchJson<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    body,
    params,
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    headers: customHeaders,
    ...customConfig
  } = options;

  // Build target URL
  let targetUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Append query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      targetUrl += (targetUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  let serializedBody: string | undefined;
  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
    serializedBody = typeof body === 'string' ? body : JSON.stringify(body);
  }

  // Setup timeout with AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(targetUrl, {
      ...customConfig,
      headers,
      body: serializedBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let detail: string | Record<string, unknown> | undefined;
      try {
        const errorJson = await response.json();
        detail = errorJson.detail || errorJson.message || errorJson;
      } catch {
        try {
          detail = await response.text();
        } catch {
          detail = undefined;
        }
      }

      const errorMessage = typeof detail === 'string' && detail.length > 0
        ? detail
        : `HTTP ${response.status} (${response.statusText || 'Error'}) from ${endpoint}`;

      throw new ApiError(errorMessage, {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        detail,
      });
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    const isAbort = (err as Error)?.name === 'AbortError';
    if (isAbort) {
      throw new ApiError(`Request to ${endpoint} timed out after ${timeoutMs}ms`, {
        status: 408,
        statusText: 'Request Timeout',
        endpoint,
        isTimeout: true,
      });
    }

    throw new ApiError(
      (err as Error)?.message || `Network error occurred while calling ${endpoint}`,
      {
        status: 0,
        statusText: 'Network Error',
        endpoint,
        isNetworkError: true,
        detail: (err as Error)?.message,
      }
    );
  }
}
