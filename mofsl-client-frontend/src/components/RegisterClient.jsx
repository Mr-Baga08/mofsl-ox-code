import React, { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ClientCredentialForm from './ClientCredentialForm';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const RegisterClient = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    client_id: '',
    api_key: '',
    userid: '',
    password: '',
    two_fa: '',
    vendor_info: '',
    client_code: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If changing userid, also update vendor_info behind the scenes
    if (name === 'userid') {
      setCredentials(prev => ({
        ...prev,
        vendor_info: value
      }));
    }
    
    // Clear errors for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFormErrors({});

    // Validate form
    let isValid = true;
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['client_id', 'api_key', 'userid', 'password', 'two_fa'];
    requiredFields.forEach(field => {
      if (!credentials[field]) {
        newErrors[field] = `This field is required`;
        isValid = false;
      }
    });
    
    // Validate PAN card format
    if (credentials.two_fa) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(credentials.two_fa)) {
        newErrors.two_fa = 'Invalid PAN card format. It should be in the format ABCDE1234F.';
        isValid = false;
      }
    }
    
    if (!isValid) {
      setFormErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Ensure vendor_info matches userid
      const registerData = {
        ...credentials,
        vendor_info: credentials.userid
      };
      
      // Make API call to register
      const response = await axios.post(
        `${API_BASE_URL}/api/register`, 
        registerData
      );

      if (response.data && response.data.status === 'SUCCESS') {
        setSuccess(true);
        
        // Redirect to login page after short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to register client.');
      }
    } catch (err) {
      console.error('Error registering client:', err);
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        setFormErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'An error occurred while registering the client.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    // All required fields should be filled
    const requiredFields = ['client_id', 'api_key', 'userid', 'password', 'two_fa'];
    const allRequiredFilled = requiredFields.every(field => credentials[field]);
    
    // No errors in the form
    const noErrors = Object.keys(formErrors).length === 0;
    
    return allRequiredFilled && noErrors;
  };

  return (
    <Card className="my-4">
      <Card.Header as="h5">Register New Client</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Client registered successfully! Redirecting to login page...
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <ClientCredentialForm 
            credentials={credentials} 
            handleChange={handleChange} 
            isUpdate={false}
            errors={formErrors}
          />

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !isFormValid()}
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
                <span className="ms-2">Registering...</span>
              </>
            ) : (
              'Register Client'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterClient;