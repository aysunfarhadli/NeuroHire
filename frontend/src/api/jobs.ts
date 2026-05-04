import { http, unwrap } from './client';
import type { ApiEnvelope, CandidateLevel, JobAnalysis, JobPost } from '@/types/api';

export async function listJobs() {
  const { data } = await http.get<ApiEnvelope<JobPost[]>>('/api/jobs');
  return unwrap(data);
}

export async function listPublicOpen() {
  const { data } = await http.get<ApiEnvelope<JobPost[]>>('/api/jobs/public/open');
  return unwrap(data);
}

export interface PublicJobFilters {
  q?: string;
  location?: string;
  employmentType?: string;
  seniority?: string;
}

export async function searchPublicJobs(filters: PublicJobFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.location) params.set('location', filters.location);
  if (filters.employmentType) params.set('employmentType', filters.employmentType);
  if (filters.seniority) params.set('seniority', filters.seniority);
  const qs = params.toString();
  const url = `/api/jobs/public/search${qs ? `?${qs}` : ''}`;
  const { data } = await http.get<ApiEnvelope<JobPost[]>>(url);
  return unwrap(data);
}

export async function getPublicJob(id: number) {
  const { data } = await http.get<ApiEnvelope<JobPost>>(`/api/jobs/public/${id}`);
  return unwrap(data);
}

export async function getJob(id: number) {
  const { data } = await http.get<ApiEnvelope<JobPost>>(`/api/jobs/${id}`);
  return unwrap(data);
}

export async function createJob(input: {
  title: string;
  description: string;
  seniority?: CandidateLevel;
  location?: string;
  employmentType?: string;
}) {
  const { data } = await http.post<ApiEnvelope<JobPost>>('/api/jobs', input);
  return unwrap(data);
}

export async function updateJob(id: number, patch: Partial<JobPost> & { status?: string }) {
  const { data } = await http.put<ApiEnvelope<JobPost>>(`/api/jobs/${id}`, patch);
  return unwrap(data);
}

export async function deleteJob(id: number) {
  await http.delete(`/api/jobs/${id}`);
}

export async function analyzeJob(id: number) {
  const { data } = await http.post<ApiEnvelope<JobAnalysis>>(`/api/jobs/${id}/analyze`);
  return unwrap(data);
}

export async function getJobAnalysis(id: number) {
  const { data } = await http.get<ApiEnvelope<JobAnalysis>>(`/api/jobs/${id}/analysis`);
  return unwrap(data);
}
