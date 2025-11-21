# 🚀 Vercel Deployment - Tam Rehber

## ✅ Tamamen Vercel'da!

Tüm sistem artık Vercel'da çalışacak:
- ✅ **Frontend:** Next.js → Vercel
- ✅ **Backend:** Next.js API Routes → Vercel (serverless functions)
- ✅ **Database:** Supabase (zaten hazır ✅)

---

## 📋 Deployment Adımları

### 1️⃣ Vercel Proje Oluşturma

1. **Vercel'a Git:** https://vercel.com
2. GitHub ile giriş yapın
3. **Add New Project** butonuna tıklayın

### 2️⃣ Repository Bağlama

1. Repository listesinden **`webrektasarim-dev/menuQr`** seçin
2. **Import** butonuna tıklayın

### 3️⃣ Root Directory Ayarlama

1. **Root Directory** bölümünde **Edit** butonuna tıklayın
2. `frontend` yazın
3. **Continue** butonuna tıklayın

### 4️⃣ Environment Variables Ekleme

**Vercel Dashboard → Project Settings → Environment Variables**

Aşağıdaki variables'ları ekleyin:

#### Database

```
DATABASE_URL=postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Önemli:**
- Password: `Ypfmqcz0.Qr` ✅
- Region: `eu-central-1` (Supabase Dashboard'dan kontrol edin, farklıysa değiştirin)
- Port: `6543` (Connection Pooling için)

**Region Kontrolü:**
1. Supabase Dashboard → Settings → Database
2. Connection String → Connection Pooling
3. Region'ı kontrol edin (eğer `eu-central-1` değilse yukarıdaki değeri değiştirin)

#### JWT Secrets

```
JWT_SECRET=[64 karakter hex string]
JWT_REFRESH_SECRET=[64 karakter hex string - farklı]
```

**Oluşturma:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### API URL

```
NEXT_PUBLIC_API_URL=/api/v1
```

**Önemli:** 
- Production, Preview ve Development için aynı değeri ekleyin
- `/api/v1` olarak ayarlayın (relative path)

#### JWT Settings (Opsiyonel)

```
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### 5️⃣ Build Settings

Vercel otomatik olarak Next.js'i algılar. Manuel ayar gerekirse:

- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (prisma generate otomatik çalışacak)
- **Output Directory:** `.next`

### 6️⃣ Deploy

1. **Deploy** butonuna tıklayın
2. Vercel otomatik olarak build ve deploy edecek
3. Deploy tamamlandığında frontend URL'inizi alın: `https://your-app.vercel.app`

---

## 🔄 Migration Çalıştırma

### Prisma Migration

Migration zaten Supabase'de var, sadece Prisma client'ı generate etmek için:

**Vercel'da otomatik olarak çalışacak** (package.json'da build script'inde)

Manuel olarak çalıştırmak isterseniz:

```bash
cd frontend
npx prisma generate
npx prisma migrate deploy
```

**Not:** Vercel build sırasında `prisma generate` otomatik çalışacak (package.json → build script)

---

## ✅ Environment Variables Kontrol Listesi

Vercel Dashboard → Project Settings → Environment Variables'da şunların olması gerekir:

| Variable Name | Örnek Value | Zorunlu |
|--------------|-------------|---------|
| `DATABASE_URL` | `postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` | ✅ Evet |
| `JWT_SECRET` | `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456` | ✅ Evet |
| `JWT_REFRESH_SECRET` | `9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba` | ✅ Evet |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | ✅ Evet |
| `JWT_EXPIRES_IN` | `7d` | ⭕ Opsiyonel |
| `NODE_ENV` | `production` | ⭕ Opsiyonel |

---

## 🧪 Test

### Frontend Test

1. Frontend URL'inize gidin: `https://your-app.vercel.app`
2. Ana sayfa yüklenmeli
3. **Register** sayfasına gidin
4. Yeni işletme oluşturun

### API Test

1. API endpoint'lerini test edin:
   - Register: `POST https://your-app.vercel.app/api/v1/auth/register`
   - Login: `POST https://your-app.vercel.app/api/v1/auth/login`

---

## 🔒 Güvenlik Notları

1. **DATABASE_URL:**
   - Asla GitHub'a commit etmeyin
   - Sadece Vercel Environment Variables'da tutun

2. **JWT Secrets:**
   - Güçlü ve rastgele olmalı (64 karakter hex)
   - Production'da değiştirmeyin (tüm token'lar geçersiz olur)

3. **API URL:**
   - `/api/v1` olarak ayarlayın (relative path)
   - Vercel otomatik olarak doğru domain'e yönlendirir

---

## 🐛 Sorun Giderme

### Build Hatası: "Prisma Client not generated"

**Sorun:** Prisma client generate edilmemiş

**Çözüm:**
1. Vercel Dashboard → Deployments → View Logs
2. Build log'larını kontrol edin
3. `prisma generate` komutunun çalıştığından emin olun

### Build Hatası: "DATABASE_URL not found"

**Sorun:** Environment variable eksik

**Çözüm:**
1. Vercel Dashboard → Project Settings → Environment Variables
2. `DATABASE_URL` ekleyin
3. Redeploy yapın

### API Hatası: "Unauthorized"

**Sorun:** JWT secret yanlış veya eksik

**Çözüm:**
1. `JWT_SECRET` doğru mu kontrol edin
2. Redeploy yapın

### Database Connection Hatası

**Sorun:** DATABASE_URL yanlış formatlanmış

**Çözüm:**
1. Supabase Dashboard'dan connection string'i tekrar kopyalayın
2. Password doğru mu kontrol edin
3. Port 6543 mü? (connection pooling için)

---

## ✅ Tamamlandı!

Artık sisteminiz tamamen Vercel'da çalışıyor! 🎉

- 🌐 **Frontend & Backend:** `https://your-app.vercel.app`
- 🗄️ **Database:** Supabase ✅
- 📚 **API Docs:** `https://your-app.vercel.app/api/v1/*`

---

## 🚀 Sonraki Adımlar

1. ✅ Vercel'da deploy edildi
2. ✅ Environment variables eklendi
3. ✅ Test edildi
4. ⏭️ Custom domain ekleyin (opsiyonel)
5. ⏭️ SSL sertifikası otomatik (Vercel'da)

**Artık sisteminiz production'da!** 🎊

