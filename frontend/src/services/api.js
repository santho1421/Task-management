import axios from 'axios';

// Base API URL pointing to the Express backend (port 5001)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1500, // 1.5 second fast timeout so requests never lag the UI
});

// Request interceptor: attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if explicitly unauthorized on standard backend session
    if (error.response && error.response.status === 401) {
      const storedUser = localStorage.getItem('taskflow_user');
      const isLocalOrFirebase = storedUser && (storedUser.includes('firebase') || storedUser.includes('local'));
      
      if (!isLocalOrFirebase) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
