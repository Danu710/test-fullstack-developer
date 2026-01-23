import { api } from './axios';

export const getUsersApi = () => api.get('/users');

export const createUserApi = (data: any) => api.post('/users', data);

export const updateUserApi = (id: string, data: any) =>
  api.put(`/users/${id}`, data);

export const deleteUserApi = (id: string) => api.delete(`/users/${id}`);
