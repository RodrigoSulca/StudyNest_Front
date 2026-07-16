import axios from 'axios';
import type { AxiosError } from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/registrar') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
