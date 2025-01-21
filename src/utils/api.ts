import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // adres Twojego API
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// Funkcja do pobierania produktów
export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Funkcja do pobierania kategorii
export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export default api;
