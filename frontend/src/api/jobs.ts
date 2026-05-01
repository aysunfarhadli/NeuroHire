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
