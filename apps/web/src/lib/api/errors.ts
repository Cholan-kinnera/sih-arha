/**
 * Standardized API Error Definitions
 */

export interface ApiErrorDetails {
  status: number;
  statusText: string;
  endpoint: string;
  detail?: string | Record<string, unknown>;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly endpoint: string;
  public readonly detail?: string | Record<string, unknown>;
  public readonly isNetworkError: boolean;
  public readonly isTimeout: boolean;

  constructor(message: string, details: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status;
    this.statusText = details.statusText;
    this.endpoint = details.endpoint;
    this.detail = details.detail;
    this.isNetworkError = Boolean(details.isNetworkError);
    this.isTimeout = Boolean(details.isTimeout);
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public get userFriendlyMessage(): string {
    if (this.isTimeout) {
      return 'The request timed out. Please check your network connection and retry.';
    }
    if (this.isNetworkError || this.status === 0) {
      return 'Unable to reach the LEWS backend service. Please verify server status and network connectivity.';
    }
    if (typeof this.detail === 'string' && this.detail.trim().length > 0) {
      return this.detail;
    }
    if (this.status === 404) {
      return 'The requested record or zone could not be found.';
    }
    if (this.status >= 500) {
      return 'The backend encountered an internal error. Please try again shortly.';
    }
    return this.message || 'An unexpected API error occurred.';
  }
}
