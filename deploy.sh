#!/bin/bash

# Car Store E-Commerce Deployment Script
# This script automates deployment to Heroku

set -e

echo "======================================"
echo "Car Store E-Commerce Deployment"
echo "======================================"
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed"
    echo "Install from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "✅ Heroku CLI found"
echo ""

# Get app name from user
read -p "Enter your Heroku app name: " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name cannot be empty"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔐 Logging into Heroku..."
heroku login

echo ""
echo "🚀 Creating/Setting up Heroku app..."
heroku create $APP_NAME --remote heroku 2>/dev/null || echo "App may already exist"

echo ""
echo "📝 Setting environment variables..."
echo ""
echo "Enter the following environment variables:"
echo ""

read -p "MongoDB URI (mongodb+srv://...): " MONGODB_URI
read -p "JWT Secret: " JWT_SECRET
read -p "Stripe Public Key: " STRIPE_PUBLIC
read -p "Stripe Secret Key: " STRIPE_SECRET

echo ""
echo "Setting variables on Heroku..."

heroku config:set NODE_ENV=production -a $APP_NAME
heroku config:set MONGODB_URI="$MONGODB_URI" -a $APP_NAME
heroku config:set JWT_SECRET="$JWT_SECRET" -a $APP_NAME
heroku config:set STRIPE_PUBLIC_KEY="$STRIPE_PUBLIC" -a $APP_NAME
heroku config:set STRIPE_SECRET_KEY="$STRIPE_SECRET" -a $APP_NAME
heroku config:set FRONTEND_URL="https://$APP_NAME.herokuapp.com" -a $APP_NAME

echo ""
echo "✅ Environment variables set"
echo ""

echo "🔍 Verifying configuration..."
heroku config -a $APP_NAME

echo ""
echo "📤 Deploying to Heroku..."
git push heroku main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is available at: https://$APP_NAME.herokuapp.com"
echo ""
echo "Next steps:"
echo "1. Visit https://$APP_NAME.herokuapp.com to verify"
echo "2. Create an admin account"
echo "3. Add sample products"
echo "4. Configure payment gateway"
echo ""
echo "View logs: heroku logs --tail -a $APP_NAME"
echo ""