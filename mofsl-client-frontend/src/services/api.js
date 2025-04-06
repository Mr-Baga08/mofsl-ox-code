// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables session cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Interceptor: Attach client_id to headers & only GET query params
api.interceptors.request.use(config => {
  const clientId = localStorage.getItem('mofsl_client_id');

  if (clientId) {
    // Always attach to headers
    config.headers['X-Client-ID'] = clientId;

    // Only append to URL for GET requests
    if (config.method === 'get') {
      const url = new URL(config.url, API_BASE_URL);
      url.searchParams.append('client_id', clientId);
      config.url = url.pathname + url.search;
    }
  }

  return config;
});

// ✅ Login API
export const login = async (clientId, password = '') => {
  try {
    const response = await api.post('/api/login', { client_id: clientId, password });

    if (response.data?.status === 'SUCCESS') {
      localStorage.setItem('mofsl_client_id', clientId);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ✅ Verify OTP API
export const verifyOTP = async (clientId, otp) => {
  try {
    const response = await api.post('/api/verify-otp', { client_id: clientId, otp });

    if (response.data?.status === 'SUCCESS') {
      localStorage.setItem('mofsl_client_id', clientId);
    }

    return response.data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

// ✅ Resend OTP API
export const resendOTP = async (clientId) => {
  try {
    return await api.post('/api/resend-otp', { client_id: clientId });
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
};

// ✅ Get Client Info (GET + client_id auto-attached)
export const getClientInfo = async () => {
  try {
    return await api.get('/api/client-info'); // `client_id` will be appended automatically
  } catch (error) {
    console.error('Get client info error:', error);
    throw error;
  }
};

// ✅ Logout API
export const logout = async () => {
  try {
    const response = await api.post('/api/logout');
    localStorage.removeItem('mofsl_client_id');
    return response.data;
  } catch (error) {
    localStorage.removeItem('mofsl_client_id');
    console.error('Logout error:', error);
    throw error;
  }
};

export default {
  login,
  verifyOTP,
  resendOTP,
  getClientInfo,
  logout,
  api
};
