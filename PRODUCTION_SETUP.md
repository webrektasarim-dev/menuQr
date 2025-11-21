# 🚀 CafeQR - Production Deployment (Supabase + Vercel)

## 📋 Gereksinimler

✅ **Supabase Projesi** - Cursor'da zaten kurulmuş
✅ **Vercel Hesabı** - Frontend için
✅ **Railway veya Render Hesabı** - Backend için

## 🔧 1. Supabase Database Hazırlığı

### Connection String Alma

1. Supabase Dashboard → Project Settings → Database
2. **Connection String** bölümünden **URI** formatını kopyala
3. Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

**Önemli:** Connection Pooling kullanın (port 6543) - Prisma için optimize edilmiş.

### Database Migration

Supabase'de migration'ları çalıştırmak için:

1. Supabase Dashboard → SQL Editor
2. `backend/prisma/schema.prisma` dosyasındaki SQL'i çalıştır
3. Veya Railway/Render'da deployment sonrası migration çalıştırılacak

## 🌐 2. Backend - Railway Deployment

### Adım 1: Railway'a Proje Ekle

1. https://railway.app → **New Project**
2. **Deploy from GitHub repo** seç
3. Repository'yi seç
4. **Root Directory:** `backend` olarak ayarla

### Adım 2: Environment Variables

Railway Dashboard → Project → Variables → **Add Variable**

```env
# Database (Supabase Connection String)
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# JWT Secrets (Güçlü secret oluşturun!)
JWT_SECRET=[32+ karakter güçlü secret - aşağıdaki komutla oluşturun]
JWT_REFRESH_SECRET=[32+ karakter güçlü secret]

# App Config
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1

# CORS (Frontend URL - Vercel deploy sonrası güncellenecek)
CORS_ORIGIN=https://your-app.vercel.app

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Redis (Opsiyonel - Upstash kullanıyorsanız)
REDIS_URL=redis://default:[PASSWORD]@[HOST]:6379
```

**JWT Secret Oluşturma:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Adım 3: Build & Deploy

Railway otomatik olarak:
1. `npm install` çalıştırır
2. `npm run postinstall` (Prisma generate) çalıştırır
3. `npm run build` çalıştırır
4. `npm run start:prod` ile başlatır

### Adım 4: Database Migration

Railway Dashboard → Deployments → **View Logs** → **Run Command**

```bash
npx prisma migrate deploy
```

Veya Railway Dashboard → **Deployments** → **Run Command** sekmesinden çalıştır.

### Adım 5: Backend URL'ini Kopyala

Railway Dashboard → **Settings** → **Domains** → **Generate Domain**

Backend URL: `https://your-backend.railway.app`

## 🎨 3. Frontend - Vercel Deployment

### Adım 1: Vercel'a Proje Ekle

1. https://vercel.com → **Add New Project**
2. **Import Git Repository**
3. Repository'yi seç
4. **Root Directory:** `frontend` olarak ayarla

### Adım 2: Environment Variables

Vercel Dashboard → Project → **Settings** → **Environment Variables**

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

**Önemli:** Production, Preview ve Development için aynı değeri ekleyin.

### Adım 3: Build Settings

Vercel otomatik olarak Next.js'i algılar. Eğer manuel ayar gerekirse:

- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### Adım 4: Deploy

Vercel otomatik olarak deploy eder. İlk deploy sonrası:

Frontend URL: `https://your-app.vercel.app`

## 🔄 4. CORS Güncelleme

Backend'de (Railway) `CORS_ORIGIN` değişkenini güncelle:

```
CORS_ORIGIN=https://your-app.vercel.app
```

Railway otomatik olarak redeploy eder.

## ✅ 5. Test

### Frontend Test

1. Frontend URL'ine git: `https://your-app.vercel.app`
2. Ana sayfa yüklenmeli
3. **Register** sayfasına git
4. Yeni işletme oluştur

### Backend Test

1. Backend URL + `/api/docs`: `https://your-backend.railway.app/api/docs`
2. Swagger UI açılmalı
3. Health check: `https://your-backend.railway.app/api/v1/health`

### API Test

```bash
# Register test
curl -X POST https://your-backend.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "businessName": "Test Cafe",
    "password": "Test123!"
  }'
```

## 📝 6. İlk Kullanım

1. Frontend'de **Register** ile işletme oluştur
2. **Login** yap
3. **Dashboard** → **Menü Yönetimi**
4. Kategori ekle
5. Ürün ekle
6. **Masa & QR Yönetimi** → Masa ekle
7. QR URL'ini kopyala ve test et

## 🔒 7. Güvenlik Kontrolleri

- ✅ JWT secrets güçlü (32+ karakter)
- ✅ CORS sadece frontend URL'ine izin veriyor
- ✅ Database connection pooling aktif
- ✅ Environment variables production'da set edilmiş
- ✅ HTTPS aktif (otomatik)

## 🐛 Sorun Giderme

### Backend Bağlanamıyor

1. Railway logs kontrol et
2. `DATABASE_URL` doğru mu?
3. Supabase connection pooling aktif mi?
4. Migration çalıştırıldı mı?

### Frontend API Hatası

1. `NEXT_PUBLIC_API_URL` doğru mu?
2. Backend çalışıyor mu?
3. CORS hatası var mı? (Browser console kontrol et)

### Database Connection Hatası

1. Supabase Dashboard → Database → Connection Pooling aktif mi?
2. Connection string'de `?pgbouncer=true` var mı?
3. Password doğru mu?

## 📊 Monitoring

### Vercel Analytics

Vercel Dashboard → Analytics → Enable

### Railway Logs

Railway Dashboard → Deployments → View Logs

### Supabase Dashboard

Supabase Dashboard → Database → Table Editor (verileri görüntüle)

## 🎉 Başarılı!

Artık sisteminiz production'da çalışıyor!

- 🌐 **Frontend:** `https://your-app.vercel.app`
- 🔧 **Backend:** `https://your-backend.railway.app`
- 📚 **API Docs:** `https://your-backend.railway.app/api/docs`
- 🗄️ **Database:** Supabase Dashboard

## 📞 Destek

Sorun yaşarsanız:
1. Railway logs kontrol et
2. Vercel build logs kontrol et
3. Supabase connection kontrol et
4. Environment variables kontrol et

