#!/bin/bash

# AWS EC2 Deployment Script
# Run this on your EC2 instance

set -e

echo "======================================"
echo "Setting up Car Store on AWS EC2"
echo "======================================"
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
echo "🚀 Starting MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /var/www/car-store
sudo chown $USER:$USER /var/www/car-store

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/car-store
git clone https://github.com/alhananamal8-crypto/car-store-ecommerce.git .

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install
npm prune --production

# Create .env file
echo "📝 Creating .env file..."
cp .env.example .env
echo ""
echo "⚠️  Edit .env file with your settings:"
echo "sudo nano /var/www/car-store/.env"
echo ""
echo "Press Enter when done editing .env file"
read

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start server.js --name "car-store"
pm2 startup
pm2 save

# Configure Nginx
echo "📝 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/car-store > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/car-store /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# Setup firewall
echo "🔐 Configuring firewall..."
sudo ufw enable -y
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Setup SSL certificate:"
echo "   sudo apt install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d yourdomain.com"
echo "3. Monitor logs:"
echo "   pm2 logs car-store"
echo ""
echo "App should be running on http://$(hostname -I | awk '{print $1}')"
echo ""
