import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const authService = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getUser: () => api.get('/auth/user'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const institutionService = {
  create: (name) => api.post('/institutions', { name }),
  getMy: () => api.get('/institutions/my'),
  joinByCode: (join_code) => api.post('/institutions/join', { join_code })
};

export const announcementService = {
  getAll: () => api.get('/announcements'),
  create: (title, content) => api.post('/announcements', { title, content })
};

export const eventService = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  register: (id, responses) => api.post(`/events/${id}/register`, { form_responses: responses }),
  getResponses: (id) => api.get(`/events/${id}/responses`),
};

export const alumniService = {
  getDirectory: (filters) => api.get('/alumni', { params: filters }),
  invite: (email) => api.post('/alumni/invite', { email }),
  getInvitations: () => api.get('/alumni/invitations'),
  removeAlumnus: (id) => api.delete(`/alumni/${id}`)
};
