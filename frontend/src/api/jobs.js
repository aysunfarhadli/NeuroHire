import { http, unwrap } from './client';
export async function listJobs() {
    const { data } = await http.get('/api/jobs');
    return unwrap(data);
}
export async function listPublicOpen() {
    const { data } = await http.get('/api/jobs/public/open');
    return unwrap(data);
}
export async function getJob(id) {
    const { data } = await http.get(`/api/jobs/${id}`);
    return unwrap(data);
}
export async function createJob(input) {
    const { data } = await http.post('/api/jobs', input);
    return unwrap(data);
}
export async function updateJob(id, patch) {
    const { data } = await http.put(`/api/jobs/${id}`, patch);
    return unwrap(data);
}
export async function deleteJob(id) {
    await http.delete(`/api/jobs/${id}`);
}
export async function analyzeJob(id) {
    const { data } = await http.post(`/api/jobs/${id}/analyze`);
    return unwrap(data);
}
export async function getJobAnalysis(id) {
    const { data } = await http.get(`/api/jobs/${id}/analysis`);
    return unwrap(data);
}
