import api from './api';

// Authentication API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login an existing user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Google OAuth backend sync
  googleLogin: async ({ name, email, googleId }) => {
    const response = await api.post('/auth/google', { name, email, googleId });
    return response.data;
  },

  // Fetch current user's profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
