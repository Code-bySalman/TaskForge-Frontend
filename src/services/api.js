import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("ENV VALUE:", import.meta.env.VITE_API_URL);
console.log("FINAL API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Project endpoints
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, memberId) => api.post(`/projects/${projectId}/members`, { memberId }),
  removeMember: (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`),
};

// Task endpoints
export const taskAPI = {
  createTask: (projectId, data) => api.post(`/tasks/projects/${projectId}/tasks`, data),
  getProjectTasks: (projectId) => api.get(`/tasks/projects/${projectId}/tasks`),
  updateTask: (taskId, data) => api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  getDashboardStats: () => api.get('/tasks/stats/dashboard'),
};

// User endpoints
export const userAPI = {
  createUser: (data) => api.post('/users', data),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
};

export default api;
