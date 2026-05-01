import { http, unwrap } from './client';
import type { ApiEnvelope } from '@/types/api';

export async function health() {
  const { data } = await http.get<ApiEnvelope<{ status: string; product: string; version: string }>>(
    '/api/meta/health'
  );
  return unwrap(data);
}
