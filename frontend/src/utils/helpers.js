import { 
  MAX_RATING, 
  MIN_RATING, 
  IMAGE_UPLOAD,
  TIME_FORMATS,
  REGEX_PATTERNS 
} from './constants';

/**
 * Calculate average rating from reviews
 * @param {Array} reviews - Array of review objects
 * @returns {number} - Average rating rounded to 1 decimal place
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }
  
  const validReviews = reviews.filter(review => 
    review && typeof review.rating === 'number' && 
    review.rating >= MIN_RATING && review.rating <= MAX_RATING
  );
  
  if (validReviews.length === 0) return 0;
  
  const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / validReviews.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Get proper image URL for display
 * @param {string} imagePath - Image path or URL
 * @param {string} defaultImage - Default image to use if path is invalid
 * @returns {string} - Complete image URL
 */
export const getImageUrl = (imagePath, defaultImage = IMAGE_UPLOAD.DEFAULT_STORE_IMAGE) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return defaultImage;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend with uploads folder
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
  
  // Default case: assume it's a filename in uploads folder
  return `/uploads/${imagePath}`;
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'relative')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'relative':
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
};

/**
 * Validate file for upload
 * @param {File} file - File to validate
 * @returns {Object} - Validation result with isValid and error
 */
export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
    return { 
      isValid: false, 
      error: `File size must be less than ${formatFileSize(IMAGE_UPLOAD.MAX_SIZE)}` 
    };
  }
  
  if (!IMAGE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please select a valid image file (JPEG, PNG, GIF)' 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate star rating display
 * @param {number} rating - Rating value
 * @param {number} maxRating - Maximum possible rating
 * @returns {Array} - Array of star objects with filled status
 */
export const generateStars = (rating = 0, maxRating = MAX_RATING) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  
  for (let i = 1; i <= maxRating; i++) {
    if (i <= roundedRating) {
      stars.push({ id: i, filled: 'full' });
    } else if (i - 0.5 === roundedRating) {
      stars.push({ id: i, filled: 'half' });
    } else {
      stars.push({ id: i, filled: 'empty' });
    }
  }
  
  return stars;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  return typeof email === 'string' && REGEX_PATTERNS.EMAIL.test(email);
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid username
 */
export const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  const trimmed = username.trim();
  return trimmed.length >= 3 && trimmed.length <= 30 && /^[a-zA-Z0-9_]+$/.test(trimmed);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid password
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6; // At least 6 characters
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  return typeof url === 'string' && REGEX_PATTERNS.URL.test(url);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} - Random ID string
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Get rating color based on value
 * @param {number} rating - Rating value
 * @returns {string} - CSS color class or hex color
 */
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return '#28a745'; // Green
  if (rating >= 3.5) return '#ffc107'; // Yellow
  if (rating >= 2.5) return '#fd7e14'; // Orange
  return '#dc3545'; // Red
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString();
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} - Percentage rounded to 1 decimal
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 1000) / 10; // Round to 1 decimal
};

/**
 * Sort array of objects by property
 * @param {Array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array
 */
export const sortBy = (array, property, direction = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} - Filtered array
 */
export const filterBySearch = (array, searchTerm, searchFields = ['name']) => {
  if (!Array.isArray(array) || !searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    searchFields.some(field =>
      item[field] && 
      typeof item[field] === 'string' && 
      item[field].toLowerCase().includes(term)
    )
  );
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Check if user is online (simple network status)
 * @returns {boolean} - True if online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};