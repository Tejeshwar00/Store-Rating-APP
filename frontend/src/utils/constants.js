// API Endpoints
export const API_ENDPOINTS = {
  STORES: '/api/stores',
  REVIEWS: '/api/reviews',
  AUTH: '/api/auth',
  USERS: '/api/users',
  UPLOAD: '/api/upload'
};

// App Configuration
export const APP_NAME = 'Store Rating App';
export const APP_VERSION = '1.0.0';

// Pagination
export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  MAX: 50,
  MIN: 5
};

export const DEFAULT_PAGE_SIZE = 10;

// Rating System
export const MAX_RATING = 5;
export const MIN_RATING = 1;
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair', 
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

// Image Upload
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  DEFAULT_STORE_IMAGE: '/default-store.jpg',
  DEFAULT_USER_AVATAR: '/default-avatar.png'
};

// Store Categories
export const STORE_CATEGORIES = [
  'Restaurant',
  'Retail',
  'Grocery',
  'Electronics',
  'Clothing',
  'Books',
  'Health & Beauty',
  'Sports & Outdoors',
  'Home & Garden',
  'Automotive',
  'Services',
  'Other'
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Toast Notification Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  REVIEW_MIN_LENGTH: 10,
  REVIEW_MAX_LENGTH: 500,
  STORE_NAME_MIN_LENGTH: 2,
  STORE_NAME_MAX_LENGTH: 100
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  RATING_HIGH: 'rating_high',
  RATING_LOW: 'rating_low',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc'
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  RATINGS: {
    FIVE_STAR: 5,
    FOUR_STAR: 4,
    THREE_STAR: 3,
    TWO_STAR: 2,
    ONE_STAR: 1
  }
};

// Time Constants
export const TIME_FORMATS = {
  DATE_ONLY: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm'
};

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  URL: /^https?:\/\/.+/
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  INVALID_RATING: 'Rating must be between 1 and 5',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Please select a valid image file',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  STORE_CREATED: 'Store created successfully!',
  STORE_UPDATED: 'Store updated successfully!',
  STORE_DELETED: 'Store deleted successfully!',
  REVIEW_ADDED: 'Review added successfully!',
  REVIEW_UPDATED: 'Review updated successfully!',
  REVIEW_DELETED: 'Review deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!'
};

// Component States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
};