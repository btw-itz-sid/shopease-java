import axios from 'axios';

/**
 * ShopEase API client.
 * Automatically attaches JWT Bearer tokens from localStorage
 * and handles 401/403 responses by clearing stale auth state.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request Interceptor: Attach JWT ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth state
      localStorage.removeItem('shopease_token');
      localStorage.removeItem('shopease_user');
      
      // Dispatch custom event so components can react
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth API methods ──
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  healthCheck: () => api.post('/auth/hash-test', { password: 'ping' }),
};

// ── Catalog (Products & Categories) API methods ──
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (slug, data) => api.put(`/products/${slug}`, data),
  deleteProduct: (slug) => api.delete(`/products/${slug}`),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  createCategory: (data) => api.post('/categories', data),
};

// ── Cart API methods ──
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart', data),
  updateQuantity: (data) => api.put('/cart', data),
  removeItem: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// ── Protected resource API methods ──
export const secureAPI = {
  getSecureResource: () => api.get('/api/test/secure-resource'),
  getBuyerResource: () => api.get('/api/test/buyer-only'),
  getSellerResource: () => api.get('/api/test/seller-only'),
};
