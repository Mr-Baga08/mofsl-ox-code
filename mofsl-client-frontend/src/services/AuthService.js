// src/services/AuthService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

// Create axios instance with credentials
const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Handle session persistence
const storeSessionLocally = (clientId, authToken) => {
  // Store in localStorage for backup and easier session debugging
  localStorage.setItem('mofsl_client_id', clientId);
  localStorage.setItem('mofsl_auth_active', 'true');
  // We don't store the actual token in localStorage for security reasons
};

const clearSessionLocally = () => {
  localStorage.removeItem('mofsl_client_id');
  localStorage.removeItem('mofsl_auth_active');
};

const getLocalClientId = () => {
  return localStorage.getItem('mofsl_client_id');
};

const isLocalAuthActive = () => {
  return localStorage.getItem('mofsl_auth_active') === 'true';
};

const AuthService = {
  /**
   * Login to the API
   * @param {string} clientId - Client ID
   * @param {string} password - Password (optional)
   * @returns {Promise} - API response
   */
  login: async (clientId, password = '') => {
    try {
      const response = await authClient.post('/api/login', { 
        client_id: clientId, 
        password 
      });
      
      if (response.data && response.data.status === 'SUCCESS') {
        // Store client ID locally for session tracking
        storeSessionLocally(clientId);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP for authentication
   * @param {string} clientId - Client ID
   * @param {string} otp - One-time password
   * @returns {Promise} - API response
   */
  verifyOTP: async (clientId, otp) => {
    try {
      const response = await authClient.post('/api/verify-otp', { 
        client_id: clientId, 
        otp 
      });
      
      if (response.data && response.data.status === 'SUCCESS') {
        // Update session info after successful OTP verification
        storeSessionLocally(clientId);
      }
      
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  /**
   * Resend OTP for authentication
   * @param {string} clientId - Client ID
   * @returns {Promise} - API response
   */
  resendOTP: async (clientId) => {
    try {
      return await authClient.post('/api/resend-otp', { client_id: clientId });
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },

  /**
   * Logout from the API
   * @returns {Promise} - API response
   */
  logout: async () => {
    try {
      const response = await authClient.post('/api/logout');
      // Clear local session data
      clearSessionLocally();
      return response.data;
    } catch (error) {
      // Still clear local data even if server logout fails
      clearSessionLocally();
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Promise} - Result with authentication status
   */
  checkAuthStatus: async () => {
    // First check local session state
    if (!isLocalAuthActive()) {
      return { isAuthenticated: false };
    }

    try {
      // Try to fetch client info as auth check
      const response = await authClient.get('/api/client-info');
      return { 
        isAuthenticated: response.data.status === 'SUCCESS',
        clientInfo: response.data.client || null
      };
    } catch (error) {
      // If 401 error, clear local session data
      if (error.response && error.response.status === 401) {
        clearSessionLocally();
      }
      return { isAuthenticated: false };
    }
  },

  /**
   * Get client information
   * @returns {Promise} - Client information
   */
  getClientInfo: async () => {
    try {
      const clientId = getLocalClientId();
      if (!clientId) {
        throw new Error('No active session');
      }

      // Include client_id in query params as fallback
      const response = await authClient.get(`/api/client-info`);
      return response.data;
    } catch (error) {
      console.error('Get client info error:', error);
      throw error;
    }
  },

  /**
   * Get local client ID
   * @returns {string|null} - Client ID or null if not authenticated
   */
  getClientId: () => {
    return getLocalClientId();
  }
};

export default AuthService;