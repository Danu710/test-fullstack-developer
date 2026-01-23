import { api } from './axios';

export const addToCartApi = (product_id: string) =>
  api.post('/cart/add', { product_id });

export const getCartApi = () => api.get('/cart');

export const checkoutApi = () => api.post('/checkout');

export const getTransactionsApi = () => api.get('/transactions');

export const getAllTransactionsApi = () => api.get('/admin/transactions');

export const payTransactionApi = (id: string) =>
  api.put(`/transactions/${id}/pay`);
