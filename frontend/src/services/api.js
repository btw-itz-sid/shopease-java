import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopease_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shopease_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth
export const authAPI = {
  register: (d) => api.post('/auth/register', d),
  login:    (d) => api.post('/auth/login', d),
  getMe:    ()  => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// ── Products
export const productAPI = {
  getAll:    (p) => api.get('/products', { params: p }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getById:   (id)   => api.get(`/products/id/${id}`),
  create:    (d) => api.post('/products', d),
  update:    (id, d) => api.put(`/products/${id}`, d),
  delete:    (id) => api.delete(`/products/${id}`),
  getMine:   (p) => api.get('/products/seller/mine', { params: p }),
  getFeatured: () => api.get('/products/featured'),
};

// ── Categories
export const categoryAPI = {
  getAll:  () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

// ── Cart
export const cartAPI = {
  get:    () => api.get('/cart'),
  add:    (d) => api.post('/cart', d),
  update: (productId, qty) => api.put(`/cart/${productId}`, { quantity: qty }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear:  () => api.delete('/cart'),
};

// ── Orders
export const orderAPI = {
  place:    (d) => api.post('/orders', d),
  getAll:   (p) => api.get('/orders', { params: p }),
  getById:  (id) => api.get(`/orders/${id}`),
  cancel:   (id) => api.patch(`/orders/${id}/cancel`),
  updateStatus: (id, d) => api.patch(`/orders/${id}/status`, d),
};

// ── Payments
export const paymentAPI = {
  createOrder: (orderId) => api.post('/payments/create-order', { order_id: orderId }),
  verify:      (d) => api.post('/payments/verify', d),
};

// ── Reviews
export const reviewAPI = {
  getByProduct: (productId, p) => api.get(`/reviews/product/${productId}`, { params: p }),
  create:  (d) => api.post('/reviews', d),
  delete:  (id) => api.delete(`/reviews/${id}`),
};

// ── Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers:  (p) => api.get('/admin/users', { params: p }),
  suspend:   (id) => api.patch(`/admin/users/${id}/suspend`),
  getOrders: (p) => api.get('/admin/orders', { params: p }),
  featureProduct: (id) => api.patch(`/admin/products/${id}/feature`),
};

// ── Upload
export const uploadAPI = {
  image: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
