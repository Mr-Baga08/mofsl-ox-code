/**
 * Utility functions for validating data in the application
 */

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate a PAN card number
   * @param {string} pan - The PAN card number to validate
   * @returns {boolean} - Whether the PAN card number is valid
   */
  export const isValidPAN = (pan) => {
    if (!pan) return false;
    
    // PAN format: AAAAA0000A (5 alphabets, 4 numbers, 1 alphabet)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };
  
  /**
   * Validate a phone number
   * @param {string} phone - The phone number to validate
   * @returns {boolean} - Whether the phone number is valid
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    
    // Remove non-numeric characters for validation
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indian phone number (10 digits)
    return cleaned.length === 10;
  };
  
  /**
   * Validate a password
   * @param {string} password - The password to validate
   * @param {Object} options - Validation options
   * @returns {boolean} - Whether the password is valid
   */
  export const isValidPassword = (password, options = {}) => {
    if (!password) return false;
    
    const {
      minLength = 8,
      requireSpecialChar = true,
      requireNumber = true,
      requireUppercase = true,
      requireLowercase = true
    } = options;
    
    // Check minimum length
    if (password.length < minLength) return false;
    
    // Check for special character
    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    
    // Check for number
    if (requireNumber && !/\d/.test(password)) return false;
    
    // Check for uppercase letter
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    
    // Check for lowercase letter
    if (requireLowercase && !/[a-z]/.test(password)) return false;
    
    return true;
  };
  
  /**
   * Get password strength (0-4)
   * @param {string} password - The password to check
   * @returns {number} - Password strength (0-4)
   */
  export const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    return strength;
  };
  
  /**
   * Validate that a required field has a value
   * @param {*} value - The field value
   * @returns {boolean} - Whether the field has a value
   */
  export const isNotEmpty = (value) => {
    if (value === undefined || value === null) return false;
    
    if (typeof value === 'string') return value.trim() !== '';
    
    return true;
  };
  
  /**
   * Validate a client ID
   * @param {string} clientId - The client ID to validate
   * @returns {boolean} - Whether the client ID is valid
   */
  export const isValidClientId = (clientId) => {
    if (!clientId) return false;
    
    // Client ID format typically alphanumeric, specific to your application
    // This is a placeholder validation - adjust based on actual format
    return /^[A-Z0-9]{4,10}$/.test(clientId);
  };
  
  /**
   * Validate an API key
   * @param {string} apiKey - The API key to validate
   * @returns {boolean} - Whether the API key is valid
   */
  export const isValidApiKey = (apiKey) => {
    if (!apiKey) return false;
    
    // API key format typically has a minimum length and character set
    // This is a placeholder validation - adjust based on actual format
    return apiKey.length >= 16 && /^[A-Za-z0-9]+$/.test(apiKey);
  };
  
  /**
   * Validate form data with specified validation rules
   * @param {Object} data - Form data to validate
   * @param {Object} rules - Validation rules
   * @returns {Object} - Validation errors
   */
  export const validateForm = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const value = data[field];
      const fieldRules = rules[field];
      
      // Check required
      if (fieldRules.required && !isNotEmpty(value)) {
        errors[field] = 'This field is required';
        return;
      }
      
      // Skip other validations if field is empty and not required
      if (!isNotEmpty(value) && !fieldRules.required) {
        return;
      }
      
      // Check specific validations
      if (fieldRules.email && !isValidEmail(value)) {
        errors[field] = 'Please enter a valid email address';
      } else if (fieldRules.pan && !isValidPAN(value)) {
        errors[field] = 'Please enter a valid PAN card number (AAAAA0000A)';
      } else if (fieldRules.phone && !isValidPhone(value)) {
        errors[field] = 'Please enter a valid 10-digit phone number';
      } else if (fieldRules.password && !isValidPassword(value, fieldRules.passwordOptions)) {
        errors[field] = 'Please enter a valid password';
      } else if (fieldRules.clientId && !isValidClientId(value)) {
        errors[field] = 'Please enter a valid client ID';
      } else if (fieldRules.apiKey && !isValidApiKey(value)) {
        errors[field] = 'Please enter a valid API key';
      } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = `This field must be at least ${fieldRules.minLength} characters long`;
      } else if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = `This field must be at most ${fieldRules.maxLength} characters long`;
      } else if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customError = fieldRules.custom(value, data);
        if (customError) {
          errors[field] = customError;
        }
      }
    });
    
    return errors;
  };