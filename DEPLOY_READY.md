# 🚀 Deployment Hazır! Şimdi Ne Yapmalı?

## ✅ Tamamlanan İşlemler

1. ✅ **Supabase Database Migration** - Tüm tablolar oluşturuldu
2. ✅ **Production dosyaları hazır** - Vercel + Railway konfigürasyonları
3. ✅ **Dockerfile hazır** - Backend için
4. ✅ **Environment variables template** hazır

## 🎯 Şimdi Yapılacaklar (5 Dakika)

### 1️⃣ Supabase Password Alın

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard/project/wczfwumhfhuwdrbhyujr
2. **Settings** → **Database**
3. **Database Password** bölümünden password'u kopyalayın (veya yeni bir tane oluşturun)

### 2️⃣ Connection String Oluşturun

Supabase Dashboard → **Settings** → **Database** → **Connection String**

**Connection Pooling** modunu seçin ve şu formatta connection string'i oluşturun:

```
postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

[PASSWORD] ve [REGION] kısımlarını doldurun.

### 3️⃣ Railway'da Backend Deploy

1. https://railway.app → **New Project**
2. **Deploy from GitHub repo** seçin
3. Repository'nizi seçin
4. **Root Directory:** `backend` olarak ayarlayın
5. **Environment Variables** ekleyin:

```env
DATABASE_URL=[Yukarıdaki connection string]
JWT_SECRET=[32+ karakter secret - aşağıdaki komutla oluşturun]
JWT_REFRESH_SECRET=[32+ karakter secret]
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
CORS_ORIGIN=https://your-app.vercel.app
REDIS_URL=[Opsiyonel - Upstash Redis kullanıyorsanız]
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

**JWT Secret Oluşturma:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Railway otomatik deploy edecek
7. Deploy sonrası **Run Command** → `npx prisma migrate deploy` çalıştırın (gerekirse)

### 4️⃣ Vercel'da Frontend Deploy

1. https://vercel.com → **Add New Project**
2. **Import Git Repository**
3. Repository'nizi seçin
4. **Root Directory:** `frontend` olarak ayarlayın
5. **Environment Variable** ekleyin:

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

6. Vercel otomatik deploy edecek

### 5️⃣ CORS Güncelleme

Railway Dashboard → **Variables** → `CORS_ORIGIN` değişkenini frontend URL'inizle güncelleyin:

```
CORS_ORIGIN=https://your-app.vercel.app
```

Railway otomatik olarak redeploy eder.

## 🎉 Tamamlandı!

Artık sisteminiz production'da çalışıyor!

- 🌐 **Frontend:** `https://your-app.vercel.app`
- 🔧 **Backend:** `https://your-backend.railway.app`
- 📚 **API Docs:** `https://your-backend.railway.app/api/docs`
- 🗄️ **Database:** Supabase'de hazır ✅

## 📞 Yardım

Sorun yaşarsanız:
1. Railway logs kontrol edin
2. Vercel build logs kontrol edin
3. Supabase connection string'i kontrol edin
4. Environment variables'ları kontrol edin

