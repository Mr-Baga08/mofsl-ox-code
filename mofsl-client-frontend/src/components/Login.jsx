// src/components/Login.jsx
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOTP } = useAuth(); // ✅ This fixes the ESLint error

  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [needOTP, setNeedOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const cleanClientId = clientId.trim().toUpperCase();
  
    try {
      const response = await login(cleanClientId, password);
  
      if (response.needOTP) {
        setNeedOTP(true);
        setSuccess('OTP sent to your registered mobile/email.');
      } else if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const cleanClientId = clientId.trim().toUpperCase();
  
    try {
      const response = await verifyOTP(cleanClientId, otp);
  
      if (response.success) {
        setSuccess('OTP verified successfully! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(response.error || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleResendOTP = async () => {
    const cleanClientId = clientId.trim().toUpperCase();
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.resendOTP(cleanClientId);
      if (response.data?.status === 'SUCCESS') {
        setSuccess('OTP resent successfully!');
      } else {
        setError(response.data?.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
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
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {!needOTP ? (
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Client ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your client ID"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value.toUpperCase())}
                      required
                    />
                  </Form.Group>

                  {<Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Form.Group> }

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !clientId.trim()}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" />
                          <span className="ms-2">Logging in...</span>
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={handleVerifyOTP}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !otp.trim()}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" />
                          <span className="ms-2">Verifying...</span>
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>

                    <Button variant="link" onClick={handleResendOTP} disabled={loading}>
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
