import { http, unwrap } from './client';
import type { ApiEnvelope, MatchResult, RankingRow } from '@/types/api';

export async function match(cvId: number, jobId: number) {
  const { data } = await http.post<ApiEnvelope<MatchResult>>('/api/match', { cvId, jobId });
  return unwrap(data);
}

export async function ranking(jobId: number) {
  const { data } = await http.get<ApiEnvelope<RankingRow[]>>(`/api/match/jobs/${jobId}/ranking`);
  return unwrap(data);
}
