import { http, unwrap } from './client';
import type { ApiEnvelope, PipelineEntry, PipelineStage } from '@/types/api';

export async function setStage(input: {
  jobId: number;
  candidateUserId: number;
  stage: PipelineStage;
  hrComment?: string;
}) {
  const { data } = await http.post<ApiEnvelope<PipelineEntry>>('/api/pipeline/stage', input);
  return unwrap(data);
}

export async function listForJob(jobId: number) {
  const { data } = await http.get<ApiEnvelope<PipelineEntry[]>>(`/api/pipeline/jobs/${jobId}`);
  return unwrap(data);
}
