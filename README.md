# CafeQR - QR Menu System for Restaurants & Cafes

Multi-tenant SaaS platform for restaurants and cafes to manage QR-based digital menus.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (Vercel)
- **Backend**: NestJS (Railway/Render)
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis (Upstash - Optional)
- **Storage**: Vercel Blob / S3

## 🚀 Production Deployment

Bu proje production için hazırlanmıştır. Local development yapılmamaktadır.

### Hızlı Başlangıç

1. **Supabase** - Database hazır ✅
2. **Railway** - Backend deploy
3. **Vercel** - Frontend deploy

Detaylı kurulum için: **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)**

## 📋 Deployment Checklist

- [ ] Supabase database oluşturuldu
- [ ] Backend Railway'da deploy edildi
- [ ] Backend environment variables ayarlandı
- [ ] Database migration çalıştırıldı
- [ ] Frontend Vercel'da deploy edildi
- [ ] Frontend environment variable ayarlandı
- [ ] CORS güncellendi
- [ ] Test edildi

## 📦 Plans

- **FREE**: 5 categories, 50 products, 3 tables
- **PREMIUM**: Unlimited everything + advanced features

## 🔒 Multi-Tenant Security

Each business has isolated data via `userId` in all queries.

## 📚 Documentation

- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - Vercel deployment rehberi
- **[SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)** - Supabase configuration
- **[ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md)** - Environment variables rehberi

## 📄 License

MIT

