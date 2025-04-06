import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Call a protected endpoint to check auth status
        const response = await axios.get(`${API_BASE_URL}/api/test-auth`, {
          withCredentials: true
        });
        
        if (response.data && response.data.status === 'SUCCESS') {
          // Try to get client info
          const clientResponse = await axios.get(`${API_BASE_URL}/api/client-info`, {
            withCredentials: true
          });
          
          if (clientResponse.data && clientResponse.data.status === 'SUCCESS') {
            setUser(clientResponse.data.client);
          }
        }
      } catch (err) {
        console.log('Not authenticated or error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (clientId, password) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        { client_id: clientId, password },
        { withCredentials: true }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        if (response.data.needOTP) {
          // Return that OTP is needed
          return { needOTP: true, clientId };
        } else {
          // Authentication successful without OTP
          // Get client info
          const clientResponse = await axios.get(`${API_BASE_URL}/api/client-info`, {
            withCredentials: true
          });
          
          if (clientResponse.data && clientResponse.data.status === 'SUCCESS') {
            setUser(clientResponse.data.client);
          }
          
          return { success: true };
        }
      } else {
        setError(response.data.message || 'Authentication failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Authentication failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Verify OTP function
  const verifyOTP = async (clientId, otp) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/api/verify-otp`,
        { client_id: clientId, otp },
        { withCredentials: true }
      );
  
      if (response.data && response.data.status === 'SUCCESS') {
        // OTP verification successful
        
        // Set a small delay to ensure the session is properly established on the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          // Get client info
          const clientResponse = await axios.get(`${API_BASE_URL}/api/client-info`, {
            withCredentials: true
          });
          
          if (clientResponse.data && clientResponse.data.status === 'SUCCESS') {
            setUser(clientResponse.data.client);
          }
        } catch (clientInfoErr) {
          console.error('Failed to fetch client info after OTP verification:', clientInfoErr);
          // Even if client info fetch fails, consider login successful
          // Set a minimal user object
          setUser({ client_id: clientId });
        }
        
        return { success: true };
      } else {
        setError(response.data.message || 'OTP verification failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'OTP verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    verifyOTP,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};