# ⚡ Hızlı Deployment Rehberi

## 🎯 5 Dakikada Deploy!

### 1️⃣ Supabase Hazırlık (Zaten yapılmış ✅)

Supabase'den şunları alın:
- Database URL (Connection String)
- (Opsiyonel) Redis URL (Upstash kullanıyorsanız)

### 2️⃣ Backend - Railway'a Deploy

1. **Railway'a Git:** https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Backend klasörünü seç**
4. **Environment Variables ekle:**

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET=[32+ karakter güçlü secret]
JWT_REFRESH_SECRET=[32+ karakter güçlü secret]
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
CORS_ORIGIN=https://your-frontend.vercel.app
REDIS_URL=redis://... (opsiyonel)
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

5. **Deploy butonuna tıkla**
6. **Migration çalıştır:** Railway Dashboard → Deployments → Run Command:
   ```bash
   npx prisma migrate deploy
   ```
7. **Backend URL'ini kopyala:** `https://your-app.railway.app`

### 3️⃣ Frontend - Vercel'a Deploy

1. **Vercel'a Git:** https://vercel.com
2. **Add New Project** → **Import Git Repository**
3. **Frontend klasörünü seç**
4. **Environment Variable ekle:**

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

5. **Deploy butonuna tıkla**
6. **Frontend URL'ini kopyala:** `https://your-app.vercel.app`

### 4️⃣ CORS Güncelleme

Backend'de (Railway) `CORS_ORIGIN` değişkenini güncelle:

```
CORS_ORIGIN=https://your-frontend.vercel.app
```

Railway otomatik olarak redeploy eder.

### 5️⃣ Test

1. Frontend URL'ine git
2. Register ol
3. Menü oluştur
4. QR kod oluştur
5. Test et! 🎉

## 🔑 Güçlü Secret Oluştur

```bash
# Terminal'de
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıktıyı `JWT_SECRET` ve `JWT_REFRESH_SECRET` olarak kullan.

## ✅ Checklist

- [ ] Supabase database hazır
- [ ] Backend Railway'da deploy edildi
- [ ] Backend environment variables eklendi
- [ ] Migration çalıştırıldı
- [ ] Frontend Vercel'da deploy edildi
- [ ] Frontend environment variable eklendi
- [ ] CORS güncellendi
- [ ] Test edildi

## 🎉 Tamamlandı!

Artık sisteminiz canlıda!

- 🌐 Frontend: `https://your-app.vercel.app`
- 🔧 Backend: `https://your-backend.railway.app`
- 📚 API Docs: `https://your-backend.railway.app/api/docs`

