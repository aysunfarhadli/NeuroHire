import { http, unwrap } from './client';
export async function health() {
    const { data } = await http.get('/api/meta/health');
    return unwrap(data);
}
