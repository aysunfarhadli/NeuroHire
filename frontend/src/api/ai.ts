import { http, unwrap } from './client';
import type { ApiEnvelope, CvAnalysisAi } from '@/types/api';

export async function analyzeCv(cvId: number, jobId?: number) {
  const url = `/api/ai/cv/${cvId}/analyze${jobId ? `?jobId=${jobId}` : ''}`;
  const { data } = await http.post<ApiEnvelope<CvAnalysisAi>>(url);
  return unwrap(data);
}

export async function latestCvAnalysis(cvId: number) {
  const { data } = await http.get<ApiEnvelope<CvAnalysisAi>>(`/api/ai/cv/${cvId}/latest`);
  return unwrap(data);
}
