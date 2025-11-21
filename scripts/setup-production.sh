#!/bin/bash
# Production Setup Script
# Bu script production environment için hazırlık yapar

echo "🔧 Production Setup Starting..."

# Backend hazırlık
echo "📦 Preparing backend..."
cd backend
npm install --production=false
npx prisma generate
cd ..

# Frontend hazırlık
echo "📦 Preparing frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Production Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Railway'da backend deploy et"
echo "2. Vercel'da frontend deploy et"
echo "3. Environment variables ekle"
echo "4. Database migration çalıştır"

