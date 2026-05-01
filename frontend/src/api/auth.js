import { http, unwrap } from './client';
export async function login(email, password) {
    const { data } = await http.post('/api/auth/login', { email, password });
    return unwrap(data);
}
export async function register(input) {
    const { data } = await http.post('/api/auth/register', input);
    return unwrap(data);
}
export async function me() {
    const { data } = await http.get('/api/auth/me');
    return unwrap(data);
}
export async function refreshToken(refreshToken) {
    const { data } = await http.post('/api/auth/refresh', { refreshToken });
    return unwrap(data);
}
