#!/bin/bash
# DrivewayCalc Deployment Script
# One-command deployment to Vercel

set -e

echo "🚀 DrivewayCalc Deployment"
echo "=========================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to production
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Your app is now live on Vercel."
