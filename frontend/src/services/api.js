import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const endpoint = userData.role === 'entrepreneur' ? '/ent/signup' : '/mentor/signup';
      
      // Ensure userData matches the backend schema
      const requestData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role,
        industry: userData.industry || 'Technology',
        skills: Array.isArray(userData.skills) ? userData.skills : (userData.skills ? userData.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
        bio: userData.bio || ''
      };
      
      // Add any additional fields based on role
      if (userData.role === 'mentor' && userData.expertise) {
        requestData.expertise = userData.expertise;
      }
      
      if (userData.role === 'entrepreneur' && userData.startupIdea) {
        requestData.startupIdea = userData.startupIdea;
      }
      
      const response = await api.post(endpoint, requestData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', userData.role);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // Ensure credentials match the backend schema
      const requestData = {
        email: credentials.email,
        password: credentials.password
      };
      
      const response = await api.post('/ent/signin', requestData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  }
};

// User services
export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  }
};

// Mentor services
export const mentorService = {
  // Get all mentors
  getMentors: async (filters = {}) => {
    try {
      const response = await api.get('/mentor', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch mentors' };
    }
  },

  // Apply to become a mentor
  applyAsMentor: async (mentorData) => {
    try {
      const response = await api.post('/mentor/apply', mentorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to apply as mentor' };
    }
  }
};

// Event services
export const eventService = {
  // Get all events
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch events' };
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create event' };
    }
  }
};

export default api;
