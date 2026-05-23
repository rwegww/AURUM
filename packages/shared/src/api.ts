import type { ApiRequestOptions } from './types';

export const DEFAULT_API_URL = 'https://chem-aurum.vercel.app/api';

export const normalizeApiBaseUrl = (url?: string | null) => {
  const raw = (url || DEFAULT_API_URL).trim();
  return raw.replace(/\/+$/, '');
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const normalizePath = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/api/') ? path.slice(4) : path;
  return clean.startsWith('/') ? clean : `/${clean}`;
};

const parseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export class AurumApiClient {
  readonly baseUrl: string;

  constructor(baseUrl = DEFAULT_API_URL) {
    this.baseUrl = normalizeApiBaseUrl(baseUrl);
  }

  async request<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { token, sessionId, headers, body, ...init } = options;
    const isFormData =
      typeof FormData !== 'undefined' &&
      body instanceof FormData;
    const requestHeaders = new Headers(headers);

    if (!requestHeaders.has('Accept')) requestHeaders.set('Accept', 'application/json');
    if (!isFormData && body !== undefined && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    if (sessionId) requestHeaders.set('X-Session-ID', sessionId);

    const url = /^https?:\/\//i.test(path)
      ? path
      : `${this.baseUrl}${normalizePath(path)}`;
    const response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      body,
    });

    const payload = await parseJson(response);
    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload && 'message' in payload
          ? String((payload as { message?: unknown }).message)
          : `HTTP ${response.status}`;
      throw new ApiError(response.status, message, payload);
    }

    return payload as T;
  }

  get<T = unknown>(path: string, options?: ApiRequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  }

  patch<T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  }

  put<T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  }

  delete<T = unknown>(path: string, options?: ApiRequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const createAurumApiClient = (baseUrl?: string | null) => new AurumApiClient(baseUrl || DEFAULT_API_URL);
