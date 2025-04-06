// src/utils/axiosConfig.js

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

// Create a custom axios instance with proper CORS settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for session authentication
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add a request interceptor to handle authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching (often helps with CORS issues)
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    // Log the client ID from localStorage if available
    const clientId = localStorage.getItem('mofsl_client_id');
    if (clientId) {
      console.log(`Request with client ID: ${clientId}`);
      // Add client_id to all requests as a query parameter for session fallback
      config.params = {
        ...config.params,
        client_id: clientId
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle session issues
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API error response:', error.response?.status, error.response?.data);
    
    // Handle session expiration or authentication issues
    if (error.response && [401, 403].includes(error.response.status)) {
      // Clear local session data
      localStorage.removeItem('mofsl_client_id');
      localStorage.removeItem('mofsl_auth_active');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        console.log('Session expired, redirecting to login');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;