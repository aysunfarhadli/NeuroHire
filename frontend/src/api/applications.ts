import { http, unwrap } from './client';
import type { ApiEnvelope, PipelineStage } from '@/types/api';

export interface MyApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  stage: PipelineStage;
  appliedAt: string;
}

export interface ApplicationResponse {
  id: number;
  candidateUserId: number;
  jobId: number;
  cvId: number | null;
  stage: PipelineStage;
  coverLetter: string | null;
  source: string | null;
  appliedAt: string;
}

export async function applyToJob(input: { jobId: number; cvId?: number; coverLetter?: string; source?: string }) {
  const { data } = await http.post<ApiEnvelope<ApplicationResponse>>('/api/applications', input);
  return unwrap(data);
}

export async function myApplications() {
  const { data } = await http.get<ApiEnvelope<MyApplication[]>>('/api/applications/me');
  return unwrap(data);
}

export async function hasApplied(jobId: number) {
  const { data } = await http.get<ApiEnvelope<{ applied: boolean }>>(`/api/applications/me/applied/${jobId}`);
  return unwrap(data).applied;
}

export async function listApplicationsForJob(jobId: number) {
  const { data } = await http.get<ApiEnvelope<ApplicationResponse[]>>(`/api/applications/job/${jobId}`);
  return unwrap(data);
}

export async function withdrawApplication(id: number) {
  await http.delete(`/api/applications/${id}`);
}

export interface CoverLetterReply {
  coverLetter: string;
  mode: 'openai' | 'template';
}

export async function generateCoverLetter(input: { jobId: number; cvId?: number }) {
  const { data } = await http.post<ApiEnvelope<CoverLetterReply>>('/api/ai/cover-letter', input);
  return unwrap(data);
}
