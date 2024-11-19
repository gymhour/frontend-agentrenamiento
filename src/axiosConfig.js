import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://gymbackend-qr97.onrender.com', // URL base del backend
});

// Interceptor para agregar el token a los headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
