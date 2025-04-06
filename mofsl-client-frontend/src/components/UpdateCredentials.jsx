import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import ClientCredentialForm from './ClientCredentialForm';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const UpdateCredentials = () => {
  const [credentials, setCredentials] = useState({
    api_key: '',
    password: '',
    two_fa: '',
    client_code: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch current client information
  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/client-info`, {
          withCredentials: true
        });
        
        if (response.data && response.data.status === 'SUCCESS') {
          setCurrentInfo(response.data.client);
          
          // Pre-fill the form with current values
          setCredentials({
            api_key: response.data.client.api_key || '',
            password: '', // Don't pre-fill password for security
            two_fa: response.data.client.two_fa || '',
            client_code: response.data.client.client_code || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch client info:', err);
        setError('Failed to load current client information. Please try refreshing the page.');
      }
    };

    fetchClientInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    // Validate PAN card format if provided
    if (credentials.two_fa) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(credentials.two_fa)) {
        newErrors.two_fa = 'Invalid PAN card format. It should be in the format ABCDE1234F.';
        isValid = false;
      }
    }
    
    // Check if any field has been changed
    const hasChanges = Object.values(credentials).some(value => value);
    if (!hasChanges) {
      setError('No changes were made. Please update at least one field.');
      setLoading(false);
      return;
    }
    
    if (!isValid) {
      setFormErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare the update data
    const updateData = {};
    
    // Only include fields that have been changed
    if (credentials.api_key) updateData.api_key = credentials.api_key;
    if (credentials.password) updateData.password = credentials.password;
    if (credentials.two_fa) updateData.two_fa = credentials.two_fa;
    
    // If userid is available in currentInfo, set vendor_info to match
    if (currentInfo && currentInfo.userid) updateData.vendor_info = currentInfo.userid;
    if (credentials.client_code) updateData.client_code = credentials.client_code;

    try {
      // Make API call to update credentials
      const response = await axios.put(
        `${API_BASE_URL}/api/update-client`, 
        updateData,
        { withCredentials: true }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        setSuccess(true);
        // Clear password field after successful update
        setCredentials(prev => ({
          ...prev,
          password: ''
        }));
      } else {
        setError(response.data.message || 'Failed to update credentials.');
      }
    } catch (err) {
      console.error('Error updating credentials:', err);
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        setFormErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'An error occurred while updating your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    // At least one field should be filled
    const hasChanges = Object.values(credentials).some(value => value);
    // No errors in the form
    const noErrors = Object.keys(formErrors).length === 0;
    
    return hasChanges && noErrors;
  };

  return (
    <Card className="my-4">
      <Card.Header as="h5">Update Your Credentials</Card.Header>
      <Card.Body>
        {currentInfo ? (
          <>
            <div className="mb-4">
              <h6>Current Information:</h6>
              <p>Client ID: <strong>{currentInfo.client_id}</strong></p>
              <p>User ID: <strong>{currentInfo.userid}</strong></p>
              <p>PAN Card: <strong>{currentInfo.two_fa}</strong></p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Your credentials have been updated successfully!</Alert>}

            <Form onSubmit={handleSubmit}>
              <ClientCredentialForm 
                credentials={credentials} 
                handleChange={handleChange} 
                isUpdate={true}
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
                    <span className="ms-2">Updating...</span>
                  </>
                ) : (
                  'Update Credentials'
                )}
              </Button>
            </Form>
          </>
        ) : (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading your information...</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UpdateCredentials;