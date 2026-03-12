#!/bin/bash
# Wandrr Backend — Railway Deploy Script
# Run this once Railway's incident is resolved

set -e

echo "🚀 Wandrr Backend Railway Deploy Script"
echo "========================================="

# Step 1: Add PostgreSQL
echo ""
echo "Step 1: Adding PostgreSQL database..."
railway add -d postgres
echo "✅ PostgreSQL added"

# Step 2: Set environment variables
echo ""
echo "Step 2: Setting environment variables..."

railway variables set \
  SPRING_PROFILES_ACTIVE=prod \
  DATABASE_URL='${{Postgres.JDBC_DATABASE_URL}}' \
  DB_USERNAME='${{Postgres.PGUSER}}' \
  DB_PASSWORD='${{Postgres.PGPASSWORD}}' \
  JWT_SECRET="$(openssl rand -base64 48)" \
  JWT_REFRESH_SECRET="$(openssl rand -base64 48)" \
  CLIENT_URL="https://wandrr-production-app.web.app" \
  FROM_EMAIL="noreply@wandrr.app" \
  2>&1

echo "✅ Environment variables set"

# Step 3: Deploy
echo ""
echo "Step 3: Deploying backend..."
railway up --detach
echo "✅ Deploy triggered"

# Step 4: Get domain
echo ""
echo "Step 4: Generating public domain..."
railway domain
echo ""
echo "========================================="
echo "🎉 Backend deploy triggered!"
echo ""
echo "IMPORTANT NEXT STEPS:"
echo "1. Wait for the build to complete on Railway dashboard"
echo "2. Copy the generated domain URL (e.g. wandrr-backend-production.up.railway.app)"
echo "3. Update frontend API URL:"
echo "   cd ../wandrr-frontend"
echo "   echo 'VITE_API_BASE_URL=https://YOUR_RAILWAY_DOMAIN' > .env.production"
echo "   npm run build"
echo "   firebase deploy --only hosting"
echo ""
