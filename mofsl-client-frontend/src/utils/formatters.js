/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a number as currency (INR)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
    if (amount === undefined || amount === null) return '--';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };
  
  /**
   * Format a date to a readable string
   * @param {string|Date} dateString - Date to format
   * @param {string} format - Format type ('short', 'long', 'time', 'datetime')
   * @returns {string} - Formatted date string
   */
  export const formatDate = (dateString, format = 'short') => {
    if (!dateString) return '--';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '--';
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-IN'); // DD/MM/YYYY
      case 'long':
        return date.toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }); // DD Month YYYY
      case 'time':
        return date.toLocaleTimeString('en-IN'); // HH:MM:SS
      case 'datetime':
        return date.toLocaleString('en-IN'); // DD/MM/YYYY, HH:MM:SS
      default:
        return date.toLocaleDateString('en-IN');
    }
  };
  
  /**
   * Format a percentage value
   * @param {number} value - The percentage value
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted percentage string
   */
  export const formatPercentage = (value, decimals = 2) => {
    if (value === undefined || value === null) return '--';
    
    return `${value.toFixed(decimals)}%`;
  };
  
  /**
   * Format a quantity with commas
   * @param {number} quantity - The quantity to format
   * @returns {string} - Formatted quantity string
   */
  export const formatQuantity = (quantity) => {
    if (quantity === undefined || quantity === null) return '--';
    
    return new Intl.NumberFormat('en-IN').format(quantity);
  };
  
  /**
   * Truncate text with ellipsis if it exceeds a certain length
   * @param {string} text - The text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength - 3)}...`;
  };
  
  /**
   * Format a phone number
   * @param {string} phoneNumber - The phone number to format
   * @returns {string} - Formatted phone number
   */
  export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      // Indian mobile format: +91 XXXXX XXXXX
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    
    // Return as is if not matching known format
    return phoneNumber;
  };
  
  /**
   * Capitalize the first letter of each word in a string
   * @param {string} text - The text to capitalize
   * @returns {string} - Capitalized text
   */
  export const capitalizeWords = (text) => {
    if (!text) return '';
    
    return text.replace(/\b\w/g, char => char.toUpperCase());
  };
  
  /**
   * Format a PAN card number with proper spacing
   * @param {string} pan - The PAN card number
   * @returns {string} - Formatted PAN card number
   */
  export const formatPAN = (pan) => {
    if (!pan) return '';
    
    // PAN format: AAAAA0000A
    // Display format: AAAAA 0000 A
    if (pan.length === 10) {
      return `${pan.substring(0, 5)} ${pan.substring(5, 9)} ${pan.substring(9)}`;
    }
    
    // Return as is if not matching format
    return pan;
  };