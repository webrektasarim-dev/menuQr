#!/bin/bash
# Backend Deployment Script for Railway
# Bu script Railway deployment sonrası çalıştırılacak

echo "🚀 Backend Deployment Starting..."

# Prisma generate (postinstall'da otomatik çalışır ama emin olmak için)
echo "📦 Generating Prisma Client..."
npx prisma generate

# Database migration
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "✅ Backend Deployment Complete!"

