import axios, { AxiosError } from 'axios';
import type { ApiEnvelope } from '@/types/api';

const TOKEN_KEY = 'hm_access';
const REFRESH_KEY = 'hm_refresh';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  refresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((cfg) => {
  const t = tokenStore.get();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

http.interceptors.response.use(
  (r) => r,
  (err: AxiosError<ApiEnvelope<unknown>>) => {
    if (err.response?.status === 401) {
      tokenStore.clear();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export function unwrap<T>(env: ApiEnvelope<T>): T {
  if (!env.success) throw new Error(env.error?.message || 'Request failed');
  return env.data;
}

export function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiEnvelope<unknown> | undefined;
    if (data?.error?.message) return data.error.message;
    if (data?.error?.fieldErrors?.length) {
      return data.error.fieldErrors.map((f) => `${f.field}: ${f.message}`).join(', ');
    }
    return err.message;
  }
  return err instanceof Error ? err.message : 'Unknown error';
}
