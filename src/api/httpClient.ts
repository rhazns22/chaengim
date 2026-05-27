import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-production-2141.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);