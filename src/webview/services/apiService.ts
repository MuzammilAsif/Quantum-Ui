import { API_ENDPOINTS } from '../constants';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * ApiService — typed HTTP client for Quantum UI backend.
 * Handles auth headers, error parsing, and response typing.
 *
 * NOTE: This is the infrastructure layer only.
 * Real API calls are wired up in feature services.
 */
class ApiService {
  private baseUrl = API_ENDPOINTS.BASE;
  private authToken: string | null = null;

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client': 'quantum-ui-vscode',
      ...extra,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async request<TResponse, TBody = unknown>(
    endpoint: string,
    options: RequestOptions<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    const { method = 'GET', body, headers: extraHeaders, signal } = options;
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: this.buildHeaders(extraHeaders),
        body: body != null ? JSON.stringify(body) : undefined,
        signal,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ message: response.statusText }));
        return {
          data: null,
          error: (errBody as { message?: string }).message ?? `HTTP ${response.status}`,
          status: response.status,
        };
      }

      const data = (await response.json()) as TResponse;
      return { data, error: null, status: response.status };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { data: null, error: 'Request cancelled', status: 0 };
      }
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        status: 0,
      };
    }
  }

  get<T>(endpoint: string, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: 'GET', signal });
  }

  post<T, B = unknown>(endpoint: string, body: B, signal?: AbortSignal) {
    return this.request<T, B>(endpoint, { method: 'POST', body, signal });
  }

  patch<T, B = unknown>(endpoint: string, body: B, signal?: AbortSignal) {
    return this.request<T, B>(endpoint, { method: 'PATCH', body, signal });
  }

  delete<T>(endpoint: string, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: 'DELETE', signal });
  }
}

// Singleton instance
export const apiService = new ApiService();