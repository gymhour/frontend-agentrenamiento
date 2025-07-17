import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiClient = axios.create({
  baseURL: 'https://gym-backend-rust.vercel.app',
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        // token expirado: limpia y redirige
        localStorage.removeItem('token');
        window.location.href = '/';
        // cancelar la petición
        return Promise.reject(new axios.Cancel('Token expirado'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      localStorage.removeItem('token');
      window.location.href = '/';
      return Promise.reject(new axios.Cancel('Token inválido'));
    }
  }
  return config;
}, error => Promise.reject(error));

apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default apiClient;