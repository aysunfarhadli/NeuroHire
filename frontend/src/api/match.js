import { http, unwrap } from './client';
export async function match(cvId, jobId) {
    const { data } = await http.post('/api/match', { cvId, jobId });
    return unwrap(data);
}
export async function ranking(jobId) {
    const { data } = await http.get(`/api/match/jobs/${jobId}/ranking`);
    return unwrap(data);
}
