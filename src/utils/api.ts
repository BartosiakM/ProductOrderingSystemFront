import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // adres Twojego API
});

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

export const generateSeoDescription = async (productId: string) => {
    const response = await api.get(`/products/${productId}/seo-description`);
    return response.data.seoDescription;
};

export default api;
