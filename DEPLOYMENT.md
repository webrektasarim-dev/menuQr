# 🚀 CafeQR - Deployment Rehberi

## 📋 Ön Gereksinimler

1. **Supabase Projesi** oluşturulmuş olmalı
2. **Vercel Hesabı** (frontend için)
3. **Railway veya Render Hesabı** (backend için)

## 🔧 1. Supabase Ayarları

### Database Connection String

1. Supabase Dashboard → Project Settings → Database
2. Connection String'i kopyala (URI formatında)
3. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Environment Variables (Supabase'den alınacak)

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - (Opsiyonel) Upstash Redis veya başka bir Redis servisi

## 🌐 2. Frontend - Vercel Deployment

### Adım 1: Vercel'e Proje Ekle

```bash
# Vercel CLI ile
npm i -g vercel
cd frontend
vercel

# Veya GitHub'dan bağla
# Vercel Dashboard → Add New Project → Import Git Repository
```

### Adım 2: Environment Variables (Vercel Dashboard)

Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
```

**Önemli:** Production, Preview ve Development için aynı değeri ekleyin.

### Adım 3: Build Settings

Vercel otomatik olarak Next.js'i algılar. Eğer manuel ayar gerekirse:

- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### Adım 4: Deploy

```bash
# Vercel CLI ile
vercel --prod

# Veya GitHub'a push yap (otomatik deploy)
git push origin main
```

## 🔧 3. Backend - Railway Deployment

### Adım 1: Railway'a Proje Ekle

1. Railway Dashboard → New Project
2. Deploy from GitHub repo
3. Backend klasörünü seç

### Adım 2: Environment Variables (Railway Dashboard)

Railway Dashboard → Project → Variables:

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Redis (Opsiyonel - Upstash kullanıyorsanız)
REDIS_URL=redis://default:[PASSWORD]@[HOST]:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# App
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1

# CORS (Frontend URL'inizi buraya ekleyin)
CORS_ORIGIN=https://your-frontend.vercel.app

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Adım 3: Database Migration

Railway'de deployment sonrası migration çalıştır:

```bash
# Railway CLI ile
railway run npx prisma migrate deploy

# Veya Railway Dashboard → Deployments → Run Command
```

### Adım 4: Build Settings

Railway otomatik olarak Dockerfile'ı algılar veya:

- **Build Command:** `npm run build`
- **Start Command:** `npm run start:prod`

## 🔧 4. Backend - Render Deployment (Alternatif)

### Adım 1: Render'a Proje Ekle

1. Render Dashboard → New → Web Service
2. GitHub repo'yu bağla
3. Backend klasörünü seç

### Adım 2: Environment Variables

Render Dashboard → Environment:

Aynı environment variables'ları Railway'daki gibi ekle.

### Adım 3: Build & Start Commands

- **Build Command:** `cd backend && npm install && npx prisma generate && npm run build`
- **Start Command:** `cd backend && npm run start:prod`

### Adım 4: Database Migration

Render Dashboard → Shell:

```bash
cd backend
npx prisma migrate deploy
```

## 🔒 5. Güvenlik Ayarları

### JWT Secret Oluştur

```bash
# Güçlü secret oluştur
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Bu çıktıyı `JWT_SECRET` ve `JWT_REFRESH_SECRET` olarak kullan.

### CORS Ayarları

Backend'de `CORS_ORIGIN` değişkenine frontend URL'inizi ekleyin:

```
CORS_ORIGIN=https://your-app.vercel.app
```

## 📝 6. Supabase Database Migration

### İlk Migration

```bash
# Local'de migration oluştur
cd backend
npx prisma migrate dev --name init

# Production'a deploy et
npx prisma migrate deploy
```

### Supabase Connection

Supabase Dashboard → Database → Connection Pooling:

- **Connection Mode:** Transaction
- **Pooler:** Session (Prisma için)

Connection string formatı:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 🧪 7. Test

### Frontend Test

1. Vercel URL'inize gidin
2. Ana sayfa yüklenmeli
3. Register/Login çalışmalı

### Backend Test

1. Backend URL + `/api/docs` - Swagger UI açılmalı
2. Backend URL + `/health` - Health check çalışmalı

### API Test

```bash
# Health check
curl https://your-backend.railway.app/api/v1/health

# Register test
curl -X POST https://your-backend.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","businessName":"Test","password":"Test123!"}'
```

## 🔄 8. Continuous Deployment

### GitHub Actions (Opsiyonel)

`.github/workflows/deploy.yml` oluştur:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

## 📊 9. Monitoring

### Vercel Analytics

Vercel Dashboard → Analytics → Enable

### Railway/Render Logs

- Railway: Dashboard → Deployments → View Logs
- Render: Dashboard → Logs

## 🐛 10. Sorun Giderme

### Frontend Build Hatası

```bash
# Local'de test et
cd frontend
npm run build
```

### Backend Connection Hatası

1. Database URL'i kontrol et
2. Supabase connection pooling açık mı?
3. IP whitelist kontrolü (Supabase)

### CORS Hatası

Backend'de `CORS_ORIGIN` değişkenini kontrol et:
```
CORS_ORIGIN=https://your-frontend.vercel.app,https://your-preview.vercel.app
```

### Migration Hatası

```bash
# Railway/Render shell'de
cd backend
npx prisma migrate status
npx prisma migrate deploy
```

## ✅ Deployment Checklist

- [ ] Supabase database oluşturuldu
- [ ] Backend environment variables ayarlandı
- [ ] Frontend environment variables ayarlandı
- [ ] Database migration çalıştırıldı
- [ ] Backend deploy edildi
- [ ] Frontend deploy edildi
- [ ] CORS ayarları yapıldı
- [ ] API test edildi
- [ ] Frontend test edildi
- [ ] SSL sertifikaları aktif (otomatik)

## 🎉 Başarılı!

Artık sisteminiz production'da çalışıyor!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- API Docs: `https://your-backend.railway.app/api/docs`

