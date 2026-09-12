# Car Accessories Store - E-commerce Platform

A comprehensive, full-stack e-commerce platform for selling car accessories including tires, batteries, and oils. Built with Node.js, Express, MongoDB, and vanilla JavaScript frontend.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: Browse products by category with advanced filtering
- **Search & Filter**: Search by name, filter by category, price range, and rating
- **Shopping Cart**: Add/remove items, manage quantities, view cart summary
- **Coupon System**: Apply discount coupons at checkout
- **Order Management**: Place orders, view order history, track order status
- **User Profiles**: Manage profile information and shipping addresses
- **Product Reviews**: Rate and review products
- **Wishlist**: Save favorite products for later

### Admin Features
- **Product Management**: Add, edit, delete products
- **Order Management**: View all orders, update order status
- **Inventory Management**: Track product stock levels
- **Coupon Management**: Create and manage discount coupons
- **Dashboard**: View sales statistics and business metrics
- **User Management**: Manage customer accounts

### Payment & Shipping
- **Multiple Payment Methods**: Credit Card, Debit Card, PayPal, Bank Transfer, Stripe
- **Secure Transactions**: Stripe integration for secure payments
- **Order Tracking**: Real-time order status updates
- **Automatic Shipping Calculation**: Free shipping above certain amount

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment Gateway**: Stripe
- **Image Upload**: Cloudinary
- **Email**: Nodemailer

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design, flexbox, grid
- **JavaScript**: Vanilla JS (no frameworks for simplicity)
- **Icons**: Font Awesome
- **API Communication**: Fetch API

## 📁 Project Structure

```
car-store-ecommerce/
├── models/
│   ├── User.js          # User schema
│   ├── Product.js       # Product schema
│   ├── Order.js         # Order schema
│   ├── Payment.js       # Payment schema
│   ├── Cart.js          # Shopping cart schema
│   └── Coupon.js        # Coupon schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product routes
│   ├── cart.js          # Cart routes
│   ├── orders.js        # Order routes
│   ├── payments.js      # Payment routes
│   ├── users.js         # User profile routes
│   └── admin.js         # Admin routes
├── public/
│   ├── index.html       # Home page
│   ├── products.html    # Products listing page
│   ├── cart.html        # Shopping cart page
│   ├── checkout.html    # Checkout page
│   ├── login.html       # Login/Register page
│   ├── css/
│   │   ├── style.css         # Main stylesheet
│   │   └── responsive.css    # Mobile responsive styles
│   └── js/
│       ├── main.js       # Main functionality
│       ├── products.js   # Products page logic
│       ├── cart.js       # Cart page logic
│       ├── checkout.js   # Checkout page logic
│       └── auth.js       # Authentication logic
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alhananamal8-crypto/car-store-ecommerce.git
   cd car-store-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/car-store

   # Server
   PORT=5000
   NODE_ENV=development

   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d

   # Stripe
   STRIPE_PUBLIC_KEY=your_public_key
   STRIPE_SECRET_KEY=your_secret_key

   # Cloudinary (Optional - for image uploads)
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret

   # Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # Frontend
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer {token}
```

### Product Endpoints

#### Get All Products
```bash
GET /api/products?category=Tires&minPrice=50&maxPrice=200&page=1&limit=12
```

#### Get Single Product
```bash
GET /api/products/{productId}
```

#### Add Product Review
```bash
POST /api/products/{productId}/review
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great product!",
  "userName": "John Doe",
  "userId": "user_id"
}
```

### Cart Endpoints

#### Get Cart
```bash
GET /api/cart/{userId}
Authorization: Bearer {token}
```

#### Add to Cart
```bash
POST /api/cart/{userId}/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}
```

#### Remove from Cart
```bash
POST /api/cart/{userId}/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product_id"
}
```

#### Apply Coupon
```bash
POST /api/cart/{userId}/apply-coupon
Authorization: Bearer {token}
Content-Type: application/json

{
  "couponCode": "SUMMER2024"
}
```

### Order Endpoints

#### Create Order
```bash
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "billingAddress": { /* same structure */ },
  "paymentMethod": "credit_card",
  "couponCode": "DISCOUNT2024"
}
```

#### Get User Orders
```bash
GET /api/orders/{userId}
Authorization: Bearer {token}
```

#### Get Order Details
```bash
GET /api/orders/detail/{orderId}
Authorization: Bearer {token}
```

#### Cancel Order
```bash
PUT /api/orders/{orderId}/cancel
Authorization: Bearer {token}
```

### Payment Endpoints

#### Create Payment Intent (Stripe)
```bash
POST /api/payments/create-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 99.99
}
```

#### Confirm Payment
```bash
POST /api/payments/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order_id",
  "transactionId": "txn_12345",
  "paymentMethod": "credit_card",
  "amount": 99.99,
  "cardDetails": {
    "cardholderName": "John Doe",
    "last4Digits": "4242",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "brand": "Visa"
  }
}
```

#### Refund Payment
```bash
POST /api/payments/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order_id",
  "refundAmount": 99.99,
  "reason": "Customer request"
}
```

### Admin Endpoints

#### Create Product
```bash
POST /api/admin/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Michelin Pilot Sport",
  "description": "High-performance tire",
  "category": "Tires",
  "price": 149.99,
  "stock": 50,
  "sku": "TIRES-001",
  "specifications": {
    "size": "225/45R18",
    "type": "Summer",
    "warranty": "3 years"
  }
}
```

#### Update Order Status
```bash
PUT /api/admin/orders/{orderId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped",
  "notes": "Order has been dispatched"
}
```

#### Get Dashboard Statistics
```bash
GET /api/admin/statistics
Authorization: Bearer {admin_token}
```

## 🎨 Frontend Pages

### Home Page (index.html)
- Hero section with call-to-action
- Product categories showcase
- Featured products
- Features/benefits section
- Newsletter subscription
- Footer with links and social media

### Products Page (products.html)
- Product grid with filtering
- Sidebar filters (category, price, rating)
- Product cards with images, ratings, prices
- Add to cart and wishlist buttons
- Responsive grid layout

### Cart Page (cart.html)
- Shopping cart items table
- Update quantity functionality
- Remove items option
- Order summary with totals
- Coupon code input
- Proceed to checkout button

### Checkout Page (checkout.html)
- Shipping address form
- Billing address form
- Payment method selection
- Card details form (for card payments)
- Order summary sidebar
- Place order button

### Login/Register Page (login.html)
- Login form
- Registration form
- Form toggle between login and register
- Input validation

## 💳 Payment Integration

### Stripe Integration
The platform integrates with Stripe for secure payment processing:

1. Frontend collects payment method information
2. Backend creates a payment intent
3. Frontend confirms payment using Stripe Elements
4. Backend processes the payment and updates order status

### Multiple Payment Methods
- Credit Card (via Stripe)
- Debit Card (via Stripe)
- PayPal
- Bank Transfer

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication
- **CORS**: Enabled with proper configuration
- **Input Validation**: Express-validator for server-side validation
- **Environment Variables**: Sensitive data stored in .env files
- **Secure Headers**: Helmet.js recommended
- **SQL Injection Prevention**: MongoDB with Mongoose (not vulnerable to SQL injection)

## 📦 Product Categories

### 1. Tires
- Size
- Type (Summer, Winter, All-Season)
- Season
- Warranty
- Brand specifications

### 2. Batteries
- Capacity (Ah)
- Voltage
- Amp Hours
- Brand compatibility

### 3. Oils
- Viscosity (5W-30, 10W-40, etc.)
- Volume (1L, 5L, etc.)
- Specification (API, ACEA)
- Synthetic/Semi-synthetic/Mineral

## 🛠️ Maintenance & Monitoring

### Health Check
```bash
GET /api/health
```

Returns:
```json
{
  "status": "Server is running",
  "timestamp": "2024-09-12T03:00:00.000Z"
}
```

## 📊 Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (hashed password)
- Addresses (multiple shipping addresses)
- Profile image
- Account status
- Login tracking
- Cart and order references

### Product Model
- Basic info (name, description, category)
- Pricing (price, discount, original price)
- Inventory (stock, SKU)
- Images (URLs and alt text)
- Specifications (category-specific details)
- Reviews and ratings
- Timestamps

### Order Model
- Order number (auto-generated)
- User reference
- Order items (product, quantity, price)
- Addresses (shipping and billing)
- Payment and order status
- Cost breakdown (subtotal, tax, shipping)
- Status history tracking

### Cart Model
- User reference
- Cart items (product ID, quantity, price)
- Pricing calculations
- Coupon tracking
- Expiration date

### Payment Model
- Order reference
- Transaction details
- Card information (masked)
- Payment status
- Refund tracking
- Security logging (IP, user agent)

### Coupon Model
- Code and description
- Discount type (percentage or fixed)
- Usage limits
- Validity dates
- Applicable categories
- Usage tracking

## 🚀 Deployment

### Heroku Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
# ... set other variables

# Deploy
git push heroku main
```

### Environment Setup for Production
```env
NODE_ENV=production
PORT=5000
# Use production MongoDB URI
MONGODB_URI=your_production_uri
# Use production Stripe keys
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@carstore.com or open an issue in the repository.

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced search with Elasticsearch
- [ ] Recommendation engine
- [ ] Loyalty program
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Admin dashboard UI
- [ ] Advanced analytics
- [ ] Inventory management system
- [ ] Integration with shipping APIs (FedEx, UPS)
- [ ] Live chat support
- [ ] Product comparison tool

---

**Last Updated**: September 2024
**Version**: 1.0.0
