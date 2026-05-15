import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Contacts API
export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  getById: (id: string) => api.get(`/contacts/${id}`),
  create: (data: { name: string; email: string; phone?: string }) =>
    api.post('/contacts', data),
  update: (id: string, data: { name: string; email: string; phone?: string }) =>
    api.put(`/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/contacts/${id}`),
};

// Email API
export const emailAPI = {
  send: (data: { contactId?: string; to?: string; subject?: string; body?: string }) =>
    api.post('/email/send', data),
  getLogs: () => api.get('/email/logs'),
};

export default api;
