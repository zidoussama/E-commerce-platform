# MERN E-Commerce Backend

A robust and scalable backend API for an e-commerce platform built with Node.js, Express.js, and MongoDB. Features a clean MVC architecture with comprehensive product management, user authentication, order processing, and admin dashboard functionality.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Product Management**: CRUD operations with categories and inventory
- **Order Processing**: Complete order lifecycle management
- **Shopping Cart**: Persistent cart functionality
- **Admin Dashboard**: Analytics, user management, product oversight
- **Authentication**: JWT-based auth with role-based access control
- **File Upload**: Image handling for products and deals
- **Email Services**: Password reset, verification, and notifications
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Centralized error management
- **Logging**: Structured logging for debugging and monitoring

## 🏗️ Architecture

### MVC Pattern
```
src/
├── controllers/     # Business logic layer
├── models/         # Data models and schemas
├── routes/         # API route definitions
├── middleware/     # Custom middleware functions
├── services/       # External service integrations
├── utils/          # Utility functions and constants
└── validators/     # Input validation rules
```

### Key Components

- **Controllers**: Handle HTTP requests and responses
- **Models**: Mongoose schemas for MongoDB collections
- **Routes**: RESTful API endpoints
- **Middleware**: Authentication, validation, error handling
- **Services**: Email, payment, and external API integrations
- **Utils**: Helper functions, constants, and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-ecommerce/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/mern-ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Make sure MongoDB is running
   mongod

   # Seed the database (optional)
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/users/register
Register a new user account.
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phonenumber": "+1234567890"
}
```

#### POST /api/users/login
Authenticate user and return JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/users/google-login
Google OAuth authentication.

### Product Endpoints

#### GET /api/products
Get all products with optional filtering.
- Query parameters: `category`, `minPrice`, `maxPrice`, `search`, `page`, `limit`

#### POST /api/products
Create a new product (Admin only).
```json
{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "category": "64f1a2b3c4d5e6f7g8h9i0j1",
  "stock": 50,
  "image": "https://example.com/image.jpg",
  "size": ["128GB", "256GB", "512GB"]
}
```

#### GET /api/products/:id
Get product by ID.

#### PUT /api/products/:id
Update product (Admin only).

#### DELETE /api/products/:id
Delete product (Admin only).

### Category Endpoints

#### GET /api/categories
Get all categories.

#### POST /api/categories
Create new category (Admin only).

#### PUT /api/categories/:id
Update category (Admin only).

#### DELETE /api/categories/:id
Delete category (Admin only).

### Cart Endpoints

#### GET /api/cart/:userId
Get user's cart.

#### POST /api/cart/add
Add item to cart.
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "quantity": 2
}
```

#### PUT /api/cart/update
Update cart item quantity.

#### DELETE /api/cart/remove
Remove item from cart.

### Order Endpoints

#### POST /api/orders
Create new order.
```json
{
  "user": "64f1a2b3c4d5e6f7g8h9i0j1",
  "items": [
    {
      "product": "64f1a2b3c4d5e6f7g8h9i0j2",
      "quantity": 1,
      "price": 999.99
    }
  ],
  "total": 999.99,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

#### GET /api/orders/:userId
Get user's orders.

#### PUT /api/orders/:id/status
Update order status (Admin only).

### Admin Dashboard

#### GET /api/dashboard/stats
Get comprehensive dashboard statistics including:
- Sales data (daily, weekly, monthly)
- Total orders, customers, products
- Top-selling products
- Low stock alerts
- Revenue trends

### User Management

#### GET /api/userinfo/:id
Get user profile information.

#### PUT /api/userinfo/:id
Update user profile.

#### POST /api/users/forgot-password
Request password reset.

#### POST /api/users/reset-password
Reset password with token.

## 🗃️ Database Models

### User
- Personal information (name, email, phone)
- Authentication (password, role)
- Address information
- Email verification and password reset tokens

### Product
- Basic info (name, description, price)
- Inventory (stock, size variants)
- Category and image
- Timestamps

### Category
- Name and description
- Product count

### Order
- User reference
- Items array with product and quantity
- Total amount and status
- Shipping information

### Cart
- User reference
- Items array
- Timestamps

### Comment
- User and product references
- Content and timestamps

### Like
- User and product references
- Timestamps

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive validation with express-validator
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers
- **Data Sanitization**: XSS protection

## 📊 Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-ecommerce
JWT_SECRET=your-production-jwt-secret
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-email-password
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@mernecommerce.com or join our Discord community.

## 🔄 Version History

### v1.0.0
- Initial release
- Basic CRUD operations for all entities
- User authentication and authorization
- Admin dashboard with analytics
- Email services integration

---

**Built with ❤️ using MERN Stack**