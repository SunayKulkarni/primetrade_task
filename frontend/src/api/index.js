import api from './axios';

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Task APIs
export const taskAPI = {
  getAll: (status) => api.get('/tasks', { params: { status } }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// User APIs (admin only)
export const userAPI = {
  getAll: () => api.get('/users'),
  delete: (id) => api.delete(`/users/${id}`),
};
