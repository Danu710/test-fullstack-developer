import { api } from './axios';

export const getProductsApi = () => api.get('/products');

export const getProductByIdApi = (id: string) => api.get(`/products/${id}`);

export const createProductApi = (data: any) => api.post('/products', data);

export const updateProductApi = (id: string, data: any) =>
  api.put(`/products/${id}`, data);

export const deleteProductApi = (id: string) => api.delete(`/products/${id}`);
