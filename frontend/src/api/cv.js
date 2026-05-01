import { http, unwrap } from './client';
export async function uploadCv(file) {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await http.post('/api/cv/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return unwrap(data);
}
export async function myCvs() {
    const { data } = await http.get('/api/cv/me');
    return unwrap(data);
}
export async function getCv(id) {
    const { data } = await http.get(`/api/cv/${id}`);
    return unwrap(data);
}
export async function deleteCv(id) {
    await http.delete(`/api/cv/${id}`);
}
