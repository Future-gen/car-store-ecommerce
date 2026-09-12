# Deployment Guide

## 🚀 Deployment Options

Choose one of the following deployment platforms:

### Option 1: Heroku (Recommended for Beginners)
### Option 2: AWS (EC2)
### Option 3: DigitalOcean
### Option 4: Railway
### Option 5: Render
### Option 6: Vercel (Frontend Only)

---

## Option 1: Deploy to Heroku

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git installed
- MongoDB Atlas account (free cluster)

### Step 1: Prepare for Deployment

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Verify app created
heroku apps
```

### Step 2: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 (free) cluster
4. Create database user
5. Get connection string
6. Copy connection string

### Step 3: Configure Environment Variables

```bash
# Set environment variables on Heroku
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/car-store"
heroku config:set JWT_SECRET="your-super-secret-key-change-this"
heroku config:set STRIPE_PUBLIC_KEY="pk_live_your_key"
heroku config:set STRIPE_SECRET_KEY="sk_live_your_key"
heroku config:set FRONTEND_URL="https://your-app-name.herokuapp.com"

# Verify variables
heroku config
```

### Step 4: Deploy Application

```bash
# Push code to Heroku
git push heroku main

# View logs
heroku logs --tail

# Open app in browser
heroku open
```

### Step 5: Monitor Deployment

```bash
# Check app status
heroku ps

# View logs
heroku logs

# Scale dynos if needed
heroku ps:scale web=1

# Restart app
heroku restart
```

### Heroku Troubleshooting

```bash
# Check build logs
heroku logs --source build

# Reset database
heroku config:unset MONGODB_URI
heroku config:set MONGODB_URI="new_uri"

# Clear cache and rebuild
heroku plugins:install heroku-repo
heroku repo:purge_cache -a your-app-name
git push heroku main
```

---

## Option 2: Deploy to AWS EC2

### Prerequisites
- AWS account
- EC2 instance (t2.micro free tier)
- Ubuntu/Amazon Linux

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch new instance
3. Select Ubuntu 20.04 LTS (free tier eligible)
4. Choose t2.micro
5. Configure security group (allow ports 80, 443, 5000)
6. Download .pem file
7. Create key pair

### Step 2: Connect to Instance

```bash
# Make key file readable
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Git
sudo apt install -y git

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### Step 4: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/alhananamal8-crypto/car-store-ecommerce.git
cd car-store-ecommerce

# Install npm dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with production settings
sudo nano .env
```

### Step 5: Configure Nginx

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/car-store
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/car-store /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 6: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start server.js --name "car-store"

# Configure PM2 startup
pm2 startup
pm2 save

# View processes
pm2 monit
```

### Step 7: Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl timer enable snap.certbot.renew.timer
```

### Step 8: Setup Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000

# Check status
sudo ufw status
```

---

## Option 3: Deploy to DigitalOcean

### Prerequisites
- DigitalOcean account ($5/month basic droplet)

### Step 1: Create Droplet

1. Go to DigitalOcean dashboard
2. Click "Create" → "Droplets"
3. Choose Ubuntu 20.04 LTS
4. Select $5/month droplet
5. Add SSH key
6. Create droplet

### Step 2: Setup (Similar to AWS)

Follows same steps as AWS EC2:
- SSH into droplet
- Install Node.js, MongoDB
- Clone repository
- Configure Nginx
- Setup PM2
- Configure SSL

---

## Option 4: Deploy to Railway

### Prerequisites
- Railway account
- GitHub account

### Step 1: Connect GitHub

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub"

### Step 2: Select Repository

1. Search for "car-store-ecommerce"
2. Select repository
3. Authorize Railway

### Step 3: Configure Environment

1. Go to Variables section
2. Add all variables from .env
3. Add MongoDB URI
4. Save

### Step 4: Deploy

```bash
# Railway auto-deploys on git push
git push origin main

# View logs
# Check Railway dashboard for deployment status
```

---

## Option 5: Deploy to Render

### Prerequisites
- Render account

### Step 1: Create Web Service

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Select "car-store-ecommerce"

### Step 2: Configure

```
Environment: Node
Build Command: npm install
Start Command: npm start
```

### Step 3: Add Environment Variables

1. Go to Environment section
2. Add all .env variables
3. Save

### Step 4: Deploy

- Render auto-deploys from main branch
- View deployment status in dashboard

---

## Post-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Setup environment variables securely
- [ ] Disable debug mode (NODE_ENV=production)
- [ ] Use strong JWT_SECRET
- [ ] Enable CORS properly
- [ ] Rate limiting implemented

### Database
- [ ] Enable MongoDB authentication
- [ ] Setup MongoDB backups
- [ ] Create database indexes
- [ ] Setup database monitoring
- [ ] Enable replica set (if using production)

### Application
- [ ] Set NODE_ENV=production
- [ ] Configure logging
- [ ] Setup error monitoring (Sentry)
- [ ] Enable CDN for static files
- [ ] Setup email notifications
- [ ] Test all payment methods
- [ ] Verify email delivery

### Monitoring
- [ ] Setup uptime monitoring
- [ ] Configure error tracking
- [ ] Setup performance monitoring
- [ ] Create backup strategy
- [ ] Setup alert notifications
- [ ] Monitor disk space
- [ ] Monitor CPU/Memory usage

### DNS & Domain
- [ ] Point domain to server
- [ ] Configure DNS records
- [ ] Setup SSL certificate
- [ ] Verify SSL working
- [ ] Test all URLs

---

## Deployment via Docker (Optional)

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/car-store
      - NODE_ENV=production
    depends_on:
      - mongo
    
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Performance Optimization

### Enable Compression

Add to server.js:

```javascript
const compression = require('compression');
app.use(compression());
```

### Enable Caching

```javascript
app.set('view cache', true);
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Database Optimization

```javascript
// Add indexes
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: "text" });
db.orders.createIndex({ userId: 1 });
```

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Heroku
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
      run: |
        npm install -g heroku
        heroku login --api-key=$HEROKU_API_KEY
        heroku git:remote -a your-app-name
        git push heroku main
```

---

## Troubleshooting Deployment

### Application Won't Start

```bash
# Check logs
heroku logs --tail  # Heroku
journal -u -f  # Linux

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Restart application
heroku restart  # Heroku
sudo systemctl restart car-store  # Linux
```

### Database Connection Failed

```bash
# Verify MongoDB is running
mongosh

# Check connection string
echo $MONGODB_URI

# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI)"
```

### Port Conflicts

```bash
# Check what's using the port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

---

## Backup & Recovery

### Backup MongoDB

```bash
# Backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/car-store" --out=./backup

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/car-store" ./backup
```

### Backup GitHub Repository

```bash
# Clone as mirror
git clone --mirror https://github.com/alhananamal8-crypto/car-store-ecommerce.git

# Create backup
tar -czf car-store-backup.tar.gz car-store-ecommerce.git
```

---

## Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Verify payment processing
3. ✅ Test email notifications
4. ✅ Monitor application logs
5. ✅ Setup automatic backups
6. ✅ Configure monitoring/alerts
7. ✅ Document deployment process
8. ✅ Create disaster recovery plan

---

**Deployment Complete!** 🚀
