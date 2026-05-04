import { http, unwrap } from './client';
import type { ApiEnvelope, Role } from '@/types/api';

export interface Metrics {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalCompanies: number;
  totalJobs: number;
  openJobs: number;
}

export interface UserRow {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  companyId: number | null;
  enabled: boolean;
}

export interface CompanyRow {
  id: number;
  name: string;
  industry: string | null;
  subscriptionPlan: string | null;
  website: string | null;
  jobCount: number;
}

export interface JobRow {
  id: number;
  title: string;
  status: string;
  location: string | null;
  employmentType: string | null;
  companyId: number;
  companyName: string;
}

export interface DashboardSnapshot {
  metrics: Metrics;
  recentUsers: UserRow[];
  companies: CompanyRow[];
  recentJobs: JobRow[];
}

export async function snapshot() {
  const { data } = await http.get<ApiEnvelope<DashboardSnapshot>>('/api/superadmin/dashboard');
  return unwrap(data);
}

export async function listUsers() {
  const { data } = await http.get<ApiEnvelope<UserRow[]>>('/api/superadmin/users');
  return unwrap(data);
}

export async function setUserEnabled(id: number, enabled: boolean) {
  const { data } = await http.patch<ApiEnvelope<UserRow>>(`/api/superadmin/users/${id}/status`, { enabled });
  return unwrap(data);
}

export async function setUserRole(id: number, role: Role) {
  const { data } = await http.patch<ApiEnvelope<UserRow>>(`/api/superadmin/users/${id}/role`, { role });
  return unwrap(data);
}

export async function setJobStatus(id: number, status: string) {
  const { data } = await http.patch<ApiEnvelope<JobRow>>(`/api/superadmin/jobs/${id}/status`, { status });
  return unwrap(data);
}
