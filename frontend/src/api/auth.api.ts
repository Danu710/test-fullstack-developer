import { api } from './axios';

export const loginApi = (data: { email: string; password: string }) =>
  api.post('/login', data);

export const meApi = () => api.get('/me');
