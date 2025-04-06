import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for session authentication
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to handle authentication
apiClient.interceptors.request.use(
  (config) => {
    // You could add auth token to headers here if using token auth
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
const authAPI = {
  /**
   * Login to the API
   * @param {string} clientId - Client ID
   * @param {string} password - Password
   * @returns {Promise} - API response
   */
  login: (clientId, password) => {
    return apiClient.post('/api/login', { client_id: clientId, password });
  },

  /**
   * Verify OTP for authentication
   * @param {string} clientId - Client ID
   * @param {string} otp - One-time password
   * @returns {Promise} - API response
   */
  verifyOTP: (clientId, otp) => {
    return apiClient.post('/api/verify-otp', { client_id: clientId, otp });
  },

  /**
   * Resend OTP for authentication
   * @param {string} clientId - Client ID
   * @returns {Promise} - API response
   */
  resendOTP: (clientId) => {
    return apiClient.post('/api/resend-otp', { client_id: clientId });
  },

  /**
   * Register a new client
   * @param {Object} clientData - Client registration data
   * @returns {Promise} - API response
   */
  register: (clientData) => {
    return apiClient.post('/api/register', clientData);
  },

  /**
   * Logout from the API
   * @returns {Promise} - API response
   */
  logout: () => {
    return apiClient.post('/api/logout');
  },

  /**
   * Test authentication status
   * @returns {Promise} - API response
   */
  testAuth: () => {
    return apiClient.get('/api/test-auth');
  }
};

// Client information API calls
const clientAPI = {
  /**
   * Get client information
   * @returns {Promise} - API response
   */
  getClientInfo: () => {
    return apiClient.get('/api/client-info');
  },

  /**
   * Update client credentials
   * @param {Object} credentials - Client credentials to update
   * @returns {Promise} - API response
   */
  updateCredentials: (credentials) => {
    return apiClient.put('/api/update-client', credentials);
  }
};

// Market data API calls
const marketAPI = {
  /**
   * Get market data
   * @param {Object} params - Market data parameters
   * @returns {Promise} - API response
   */
  getMarketData: (params) => {
    return apiClient.get('/api/market-data', { params });
  }
};

// Order management API calls
const orderAPI = {
  /**
   * Get order book
   * @returns {Promise} - API response
   */
  getOrderBook: () => {
    return apiClient.get('/api/orders');
  },

  /**
   * Place a new order
   * @param {Object} orderData - Order data
   * @returns {Promise} - API response
   */
  placeOrder: (orderData) => {
    return apiClient.post('/api/orders', orderData);
  },

  /**
   * Modify an existing order
   * @param {string} orderId - Order ID
   * @param {Object} orderData - Order data to update
   * @returns {Promise} - API response
   */
  modifyOrder: (orderId, orderData) => {
    return apiClient.put(`/api/orders/${orderId}`, orderData);
  },

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @returns {Promise} - API response
   */
  cancelOrder: (orderId) => {
    return apiClient.delete(`/api/orders/${orderId}`);
  }
};

// Portfolio API calls
const portfolioAPI = {
  /**
   * Get positions
   * @returns {Promise} - API response
   */
  getPositions: () => {
    return apiClient.get('/api/positions');
  },

  /**
   * Get holdings
   * @returns {Promise} - API response
   */
  getHoldings: () => {
    return apiClient.get('/api/holdings');
  },

  /**
   * Get funds
   * @returns {Promise} - API response
   */
  getFunds: () => {
    return apiClient.get('/api/funds');
  }
};

// Report API calls
const reportAPI = {
  /**
   * Get trade book
   * @param {Object} params - Trade book parameters
   * @returns {Promise} - API response
   */
  getTradeBook: (params) => {
    return apiClient.get('/api/trade-book', { params });
  },

  /**
   * Get P&L report
   * @param {Object} params - P&L report parameters
   * @returns {Promise} - API response
   */
  getPnlReport: (params) => {
    return apiClient.get('/api/pnl-report', { params });
  }
};

// Export all API services
export {
  apiClient,
  authAPI,
  clientAPI,
  marketAPI,
  orderAPI,
  portfolioAPI,
  reportAPI
};

// Default export for convenience
export default {
  auth: authAPI,
  client: clientAPI,
  market: marketAPI,
  order: orderAPI,
  portfolio: portfolioAPI,
  report: reportAPI
};