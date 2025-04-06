import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * A reusable component for client credential fields
 * 
 * @param {Object} credentials - Current credential values
 * @param {Function} handleChange - Function to handle input changes
 * @param {boolean} isUpdate - Whether this form is for updating existing credentials
 * @param {Object} errors - Validation errors for form fields
 * @returns {JSX.Element} - The credential form component
 */
const ClientCredentialForm = ({ 
  credentials, 
  handleChange, 
  isUpdate = false, 
  errors = {} 
}) => {
  
  // Validate PAN card format
  const isPanValid = (pan) => {
    if (!pan) return isUpdate; // Empty is valid when updating (not changing)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  return (
    <>
      {!isUpdate && (
        <Form.Group className="mb-3">
          <Form.Label>Client ID</Form.Label>
          <Form.Control
            type="text"
            name="client_id"
            value={credentials.client_id || ''}
            onChange={handleChange}
            placeholder="Enter client ID"
            isInvalid={errors.client_id}
            disabled={isUpdate}
            required={!isUpdate}
          />
          {errors.client_id && (
            <Form.Control.Feedback type="invalid">
              {errors.client_id}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>API Key</Form.Label>
        <Form.Control
          type="text"
          name="api_key"
          value={credentials.api_key || ''}
          onChange={handleChange}
          placeholder="Enter API key"
          isInvalid={errors.api_key}
          required={!isUpdate}
        />
        {errors.api_key && (
          <Form.Control.Feedback type="invalid">
            {errors.api_key}
          </Form.Control.Feedback>
        )}
        {isUpdate && (
          <Form.Text className="text-muted">
            Leave blank if you don't want to change your API key.
          </Form.Text>
        )}
      </Form.Group>

      {!isUpdate && (
        <Form.Group className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            name="userid"
            value={credentials.userid || ''}
            onChange={handleChange}
            placeholder="Enter user ID"
            isInvalid={errors.userid}
            required={!isUpdate}
          />
          {errors.userid && (
            <Form.Control.Feedback type="invalid">
              {errors.userid}
            </Form.Control.Feedback>
          )}
          <Form.Text className="text-muted">
            Note: Vendor Info will be automatically set to match your User ID.
          </Form.Text>
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={credentials.password || ''}
          onChange={handleChange}
          placeholder="Enter password"
          isInvalid={errors.password}
          required={!isUpdate}
          autoComplete={isUpdate ? "new-password" : "current-password"}
        />
        {errors.password && (
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        )}
        {isUpdate && (
          <Form.Text className="text-muted">
            Leave blank if you don't want to change your password.
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>PAN Card (Two Factor Authentication)</Form.Label>
        <Form.Control
          type="text"
          name="two_fa"
          value={credentials.two_fa || ''}
          onChange={handleChange}
          placeholder="Enter PAN card"
          isInvalid={errors.two_fa || (credentials.two_fa && !isPanValid(credentials.two_fa))}
          required={!isUpdate}
        />
        {errors.two_fa ? (
          <Form.Control.Feedback type="invalid">
            {errors.two_fa}
          </Form.Control.Feedback>
        ) : credentials.two_fa && !isPanValid(credentials.two_fa) && (
          <Form.Control.Feedback type="invalid">
            Invalid PAN card format. It should be in the format ABCDE1234F.
          </Form.Control.Feedback>
        )}
        {isUpdate && (
          <Form.Text className="text-muted">
            Leave blank if you don't want to change your PAN card.
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Client Code</Form.Label>
        <Form.Control
          type="text"
          name="client_code"
          value={credentials.client_code || ''}
          onChange={handleChange}
          placeholder="Enter client code (optional)"
          isInvalid={errors.client_code}
        />
        {errors.client_code && (
          <Form.Control.Feedback type="invalid">
            {errors.client_code}
          </Form.Control.Feedback>
        )}
        {isUpdate && (
          <Form.Text className="text-muted">
            Leave blank if you don't want to change your client code.
          </Form.Text>
        )}
      </Form.Group>
      
      {/* Vendor Info is handled by the backend automatically */}
    </>
  );
};

export default ClientCredentialForm;