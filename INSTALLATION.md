# Installation & Setup Guide

## System Requirements

### Minimum Requirements
- Node.js: v14.0.0 or higher
- npm: v6.0.0 or higher
- MongoDB: v4.4 or higher
- RAM: 2GB minimum
- Disk Space: 500MB minimum

### Recommended Requirements
- Node.js: v18.0.0 or higher
- npm: v8.0.0 or higher
- MongoDB: v5.0 or higher
- RAM: 4GB or more
- Disk Space: 1GB or more

## Step-by-Step Installation

### 1. Prerequisites Installation

#### Install Node.js

**Windows & macOS**:
1. Visit [nodejs.org](https://nodejs.org/)
2. Download LTS version
3. Run installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install MongoDB

**Option 1: Local Installation**

**Windows**:
1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer
3. Select "Install MongoDB as a Service"
4. Complete installation

**macOS**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian)**:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Visit [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Use in .env file

### 2. Clone Repository

```bash
# Using HTTPS
git clone https://github.com/alhananamal8-crypto/car-store-ecommerce.git

# Or using SSH
git clone git@github.com:alhananamal8-crypto/car-store-ecommerce.git

# Navigate to project
cd car-store-ecommerce
```

### 3. Install Dependencies

```bash
# Install npm packages
npm install

# Or using yarn
yarn install

# Verify installation
npm list
```

### 4. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**For Development**:
```env
# Server
PORT=5000
NODE_ENV=development

# Database (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/car-store
DB_NAME=car-store

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Stripe (Get from https://stripe.com)
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Cloudinary (Optional for image uploads)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@carstore.com

# Frontend
FRONTEND_URL=http://localhost:5000

# Logging
LOG_LEVEL=info
```

**For Production**:
```env
PORT=5000
NODE_ENV=production

# Use MongoDB Atlas URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car-store

# Strong JWT secret
JWT_SECRET=generate_long_random_string_here
JWT_EXPIRE=7d

# Production Stripe keys
STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key

# Production settings
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=error
```

### 5. Verify MongoDB Connection

```bash
# Test local connection
mongo --version
mongod --version

# Or use MongoDB CLI
mongosh

# Inside shell
show dbs
use car-store
```

### 6. Initialize Sample Data (Optional)

```bash
# Create script file: seed.js
node scripts/seed.js
```

### 7. Start Development Server

```bash
# Using npm
npm run dev

# Or using node directly
node server.js

# Expected output:
# ✓ Connected to MongoDB
# 🚀 Server running on http://localhost:5000
# Environment: development
```

### 8. Verify Installation

Open browser and check:

- **Home Page**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **Console**: Check for any errors

## Post-Installation Setup

### 1. Create Admin Account

```bash
# Use API to register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@carstore.com",
    "phone": "+1234567890",
    "password": "AdminPassword123"
  }'

# Then manually update user role in MongoDB
db.users.updateOne(
  { email: "admin@carstore.com" },
  { $set: { role: "admin" } }
)
```

### 2. Add Sample Products

```bash
# Via API (as admin)
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "name": "Michelin Pilot Sport",
    "description": "High-performance tire",
    "category": "Tires",
    "price": 149.99,
    "stock": 50,
    "sku": "TIRE-001"
  }'
```

### 3. Configure Payment Gateway

#### Stripe Setup
1. Visit [stripe.com](https://stripe.com)
2. Create account
3. Get API keys from Dashboard
4. Add to .env file
5. Test with [Stripe test cards](https://stripe.com/docs/testing)

Test Card Numbers:
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- Amex: 3782 822463 10005

### 4. Setup Email (Optional)

#### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use in SMTP_PASS

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
```

## Troubleshooting

### MongoDB Connection Issues

**Problem**: "Cannot connect to MongoDB"

**Solutions**:
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB (if not running)
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use

**Problem**: "Port 5000 is already in use"

**Solutions**:
```bash
# Change port in .env
PORT=5001

# Or kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### npm Install Issues

**Problem**: "npm ERR! code ERESOLVE"

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Use yarn instead
yarn install
```

### Environment Variables Not Loading

**Problem**: "Cannot read property of undefined"

**Solutions**:
```bash
# Verify .env file exists
ls -la | grep .env

# Check env file syntax
cat .env

# Restart server after .env changes
npm run dev
```

## Next Steps

After successful installation:

1. **Read Documentation**
   - Review README.md
   - Check API_DOCUMENTATION.md
   - Study CONTRIBUTING.md

2. **Test the Application**
   - Browse products
   - Add items to cart
   - Test checkout flow
   - Create test orders

3. **Configure Features**
   - Set up email notifications
   - Configure image uploads
   - Add sample products
   - Create test coupons

4. **Customize**
   - Update branding
   - Modify colors/styles
   - Add business information
   - Configure shipping rates

## Getting Help

- **Documentation**: Check README.md and other docs
- **Issues**: Search existing GitHub issues
- **Discussions**: Open a discussion
- **Email**: support@carstore.com
- **Community**: Stack Overflow tag: car-store-ecommerce

## Development Tools

### Recommended IDE
- **VS Code** - Free, lightweight
- **WebStorm** - Full-featured (paid)
- **Sublime Text** - Fast, customizable

### VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-mongodb",
    "REST Client",
    "Prettier",
    "ESLint"
  ]
}
```

### Useful Tools
- **Postman** - API testing
- **MongoDB Compass** - Database GUI
- **Git** - Version control
- **Terminal/CMD** - Command line

---

**Setup Complete!** 🎉

Your Car Accessories Store is ready for development!
