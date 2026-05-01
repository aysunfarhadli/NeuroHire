import { http, unwrap } from './client';
import type { ApiEnvelope, AuthResponse, Role, User } from '@/types/api';

export async function login(email: string, password: string) {
  const { data } = await http.post<ApiEnvelope<AuthResponse>>('/api/auth/login', { email, password });
  return unwrap(data);
}

export async function register(input: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  companyId?: number | null;
}) {
  const { data } = await http.post<ApiEnvelope<AuthResponse>>('/api/auth/register', input);
  return unwrap(data);
}

export async function me() {
  const { data } = await http.get<ApiEnvelope<User>>('/api/auth/me');
  return unwrap(data);
}

export async function refreshToken(refreshToken: string) {
  const { data } = await http.post<ApiEnvelope<AuthResponse>>('/api/auth/refresh', { refreshToken });
  return unwrap(data);
}
