import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Login = () => {
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();
  
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [needOTP, setNeedOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(clientId, password);
      
      if (result.needOTP) {
        setNeedOTP(true);
      } else if (result.success) {
        // Redirect to dashboard on successful login
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await verifyOTP(clientId, otp);
      
      if (result.success) {
        // Redirect to dashboard on successful verification
        navigate('/');
      } else {
        setError(result.error || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during OTP verification. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resend-otp`,
        { client_id: clientId },
        { withCredentials: true }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        // Show success message
        setError({ type: 'success', message: 'OTP resent successfully.' });
      } else {
        setError(response.data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while resending OTP.');
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h4" className="text-center">
              {needOTP ? 'Verify OTP' : 'Login to MOFSL API'}
            </Card.Header>
            <Card.Body>
              {error && typeof error === 'string' && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              {error && typeof error === 'object' && error.type === 'success' && (
                <Alert variant="success">{error.message}</Alert>
              )}

              {!needOTP ? (
                // Login Form
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="clientId">
                    <Form.Label>Client ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your client ID"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Logging in...</span>
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </div>
                </Form>
              ) : (
                // OTP Verification Form
                <Form onSubmit={handleVerifyOTP}>
                  <Form.Group className="mb-3" controlId="otp">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the OTP sent to your registered mobile/email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      OTP has been sent to your registered mobile number/email.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Verifying...</span>
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>
                    
                    <Button 
                      variant="link" 
                      onClick={handleResendOTP}
                      disabled={loading}
                    >
                      Resend OTP
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setNeedOTP(false)}
                      disabled={loading}
                    >
                      Back to Login
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;