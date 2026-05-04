import { http, unwrap } from './client';
import type { ApiEnvelope, Company } from '@/types/api';

export async function listPublicCompanies() {
  const { data } = await http.get<ApiEnvelope<Company[]>>('/api/companies/public');
  return unwrap(data);
}

export async function getPublicCompany(id: number) {
  const { data } = await http.get<ApiEnvelope<Company>>(`/api/companies/public/${id}`);
  return unwrap(data);
}

export async function listCompanies() {
  const { data } = await http.get<ApiEnvelope<Company[]>>('/api/companies');
  return unwrap(data);
}

export async function getCompany(id: number) {
  const { data } = await http.get<ApiEnvelope<Company>>(`/api/companies/${id}`);
  return unwrap(data);
}
