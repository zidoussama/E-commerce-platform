// Application constants

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Order statuses
const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

// Payment methods
const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

// Product categories (can be expanded)
const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Jewelry',
  'Office Supplies'
];

// File upload limits
const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// JWT settings
const JWT_SETTINGS = {
  ALGORITHM: 'HS256',
  ISSUER: 'mern-ecommerce-app'
};

// Email settings
const EMAIL_TEMPLATES = {
  PASSWORD_RESET: 'password_reset',
  EMAIL_VERIFICATION: 'email_verification',
  ORDER_CONFIRMATION: 'order_confirmation',
  WELCOME: 'welcome'
};

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  PRODUCT_OUT_OF_STOCK: 'Product out of stock'
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  PRODUCT_CREATED: 'Product created successfully',
  ORDER_PLACED: 'Order placed successfully',
  PASSWORD_RESET: 'Password reset successful'
};

module.exports = {
  USER_ROLES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PRODUCT_CATEGORIES,
  FILE_LIMITS,
  PAGINATION,
  JWT_SETTINGS,
  EMAIL_TEMPLATES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};