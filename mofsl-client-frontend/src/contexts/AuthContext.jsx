// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { isAuthenticated, clientInfo } = await AuthService.checkAuthStatus();
        
        if (isAuthenticated && clientInfo) {
          setUser(clientInfo);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (clientId, password = '') => {
    try {
      setError(null);
      const response = await AuthService.login(clientId, password);

      if (response && response.status === 'SUCCESS') {
        if (response.needOTP) {
          // Return that OTP is needed
          return { needOTP: true, clientId };
        } else {
          // Authentication successful without OTP
          try {
            // Get client info
            const clientResponse = await AuthService.getClientInfo();
            
            if (clientResponse && clientResponse.status === 'SUCCESS') {
              setUser(clientResponse.client);
            } else {
              // If no client info, set minimal user object
              setUser({ client_id: clientId });
            }
          } catch (clientErr) {
            console.error('Client info fetch error:', clientErr);
            // Set minimal user object if client info fetch fails
            setUser({ client_id: clientId });
          }
          
          return { success: true };
        }
      } else {
        const errorMsg = response.message || 'Authentication failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
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
      const response = await AuthService.verifyOTP(clientId, otp);
  
      if (response && response.status === 'SUCCESS') {
        // OTP verification successful
        
        // Set a small delay to ensure the session is properly established on the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          // Get client info
          const clientResponse = await AuthService.getClientInfo();
          
          if (clientResponse && clientResponse.status === 'SUCCESS') {
            setUser(clientResponse.client);
          } else {
            // If no client info, set minimal user object
            setUser({ client_id: clientId });
          }
        } catch (clientErr) {
          console.error('Client info fetch error after OTP:', clientErr);
          // Set minimal user object if client info fetch fails
          setUser({ client_id: clientId });
        }
        
        return { success: true };
      } else {
        const errorMsg = response.message || 'OTP verification failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'OTP verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  };

  // Refresh user info
  const refreshUserInfo = async () => {
    if (!user) return;
    
    try {
      const response = await AuthService.getClientInfo();
      if (response && response.status === 'SUCCESS') {
        setUser(response.client);
      }
    } catch (err) {
      console.error('User info refresh error:', err);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    verifyOTP,
    logout,
    refreshUserInfo,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};