import { http, unwrap } from './client';
export async function analyzeCv(cvId, jobId) {
    const url = `/api/ai/cv/${cvId}/analyze${jobId ? `?jobId=${jobId}` : ''}`;
    const { data } = await http.post(url);
    return unwrap(data);
}
export async function latestCvAnalysis(cvId) {
    const { data } = await http.get(`/api/ai/cv/${cvId}/latest`);
    return unwrap(data);
}
