
import axios from 'axios';
import { api } from './userClient';

export const cartApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CART_SERVICE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});
cartApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token tetap ditangani oleh user-service.
        await api.patch('/auth/refresh-token');
        // Ulangi request produk setelah refresh berhasil.
        return cartApi(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);