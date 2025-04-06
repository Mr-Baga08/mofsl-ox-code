import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import axios from 'axios';

// axios.defaults.withCredentials = true;

// Context providers
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import NavbarComponent from './components/NavbarComponent';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import RegisterClient from './components/RegisterClient';
import Dashboard from './components/Dashboard';
import ClientSettings from './components/ClientSettings';
import UpdateCredentials from './components/UpdateCredentials';
import ForgotPassword from './components/ForgotPassword';
import NotFound from './components/NotFound';

// Main application router component with auth checking
const AppRouter = () => {
  const { loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <>
      {isAuthenticated && <NavbarComponent />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterClient /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          
          {/* Settings routes */}
          <Route path="settings" element={<ClientSettings />} />
          <Route path="settings/credentials" element={<ClientSettings />} />
          <Route path="update-credentials" element={<UpdateCredentials />} />
        </Route>
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast notifications container */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

// Main App component wrapped with context providers
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <AppRouter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;