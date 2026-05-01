import { http, unwrap } from './client';
export async function setStage(input) {
    const { data } = await http.post('/api/pipeline/stage', input);
    return unwrap(data);
}
export async function listForJob(jobId) {
    const { data } = await http.get(`/api/pipeline/jobs/${jobId}`);
    return unwrap(data);
}
