# 🔧 Environment Variables - Detaylı Adım Adım Rehber

## 📍 Railway Dashboard'a Gitme

1. **Railway.app** adresine gidin: https://railway.app
2. GitHub ile giriş yapın
3. Projenizi seçin: **menuQr**
4. Üst menüden **Variables** sekmesine tıklayın

---

## 1️⃣ DATABASE_URL - Supabase Connection String

### Adım 1: Supabase Password Alma

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard/project/wczfwumhfhuwdrbhyujr/settings/database
2. VEYA: Supabase Dashboard → **Settings** (⚙️ sol menü) → **Database**
3. **Database Password** bölümünü bulun
4. Eğer password'u hatırlamıyorsanız:
   - **Reset Database Password** butonuna tıklayın
   - Yeni güçlü bir password oluşturun (kaydedin!)
   - Password sadece bir kez gösterilir!

### Adım 2: Connection String Oluşturma

1. Aynı **Database** sayfasında aşağı kaydırın
2. **Connection String** bölümünü bulun
3. **Connection Pooling** tab'ını seçin (Production için önerilen)
4. **Session mode** seçeneğini seçin
5. **URI** formatındaki string'i göreceksiniz

**Connection String Formatı:**

```
postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Adım Adım:**

1. `[PASSWORD]` kısmını yukarıda aldığınız password ile değiştirin
2. `[REGION]` kısmı Supabase Dashboard'da gösterilir (örn: `eu-central-1`, `us-east-1`)
3. Tam format şöyle olmalı:

**Örnek (Gerçek format):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:MySecurePass123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Adım 3: Railway'a Ekleme

1. Railway Dashboard → **Variables** sekmesi
2. Sağ üstteki **+ New Variable** (veya **+ Add Variable**) butonuna tıklayın
3. **Variable Name** alanına: `DATABASE_URL`
4. **Variable Value** alanına: Yukarıda oluşturduğunuz connection string'i yapıştırın
5. **Add** (veya **Save**) butonuna tıklayın

**Görsel Kontrol:**
```
Railway Variables Sekmesi:
┌─────────────────────────────────────┐
│ Variables                           │
├─────────────────────────────────────┤
│ + New Variable                      │
├─────────────────────────────────────┤
│ Variable Name: [DATABASE_URL      ] │
│ Variable Value: [postgresql://...] │
│ [ Add ]                             │
└─────────────────────────────────────┘
```

✅ **Kontrol:** Variables listesinde `DATABASE_URL` görünmeli

---

## 2️⃣ JWT_SECRET - JWT Token Secret Key

### Adım 1: Güçlü Secret Oluşturma

**Yöntem 1: Node.js ile (Önerilen)**

Terminal'de veya Railway'da Run Command ile:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Çıktı Örneği:**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

**Yöntem 2: Online Tool**

1. https://www.random.org/strings/ adresine gidin
2. Ayarlar:
   - **Length:** 64
   - **Character set:** Hexadecimal (0-9, a-f)
3. **Generate Strings** butonuna tıklayın
4. Oluşturulan string'i kopyalayın

**ÖNEMLİ:**
- ✅ En az 32 byte = 64 hex karakter
- ✅ Güçlü ve rastgele olmalı
- ✅ Production'da değiştirmeyin!

### Adım 2: Railway'a Ekleme

1. Railway Dashboard → **Variables** sekmesi
2. **+ New Variable** butonuna tıklayın
3. **Variable Name:** `JWT_SECRET`
4. **Variable Value:** Yukarıda oluşturduğunuz 64 karakterlik hex string'i yapıştırın
5. **Add** butonuna tıklayın

**Örnek:**
```
Variable Name: JWT_SECRET
Variable Value: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

✅ **Kontrol:** Variables listesinde `JWT_SECRET` görünmeli

---

## 3️⃣ JWT_REFRESH_SECRET - Refresh Token Secret

### Adım 1: İkinci Secret Oluşturma

**FARKLI bir secret oluşturun!** (Aynı secret'ı kullanmayın)

Yukarıdaki gibi aynı komutu tekrar çalıştırın:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Yeni Çıktı Örneği:**
```
9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba
```

### Adım 2: Railway'a Ekleme

1. Railway Dashboard → **Variables** sekmesi
2. **+ New Variable** butonuna tıklayın
3. **Variable Name:** `JWT_REFRESH_SECRET`
4. **Variable Value:** İkinci (farklı) 64 karakterlik hex string'i yapıştırın
5. **Add** butonuna tıklayın

**Örnek:**
```
Variable Name: JWT_REFRESH_SECRET
Variable Value: 9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba
```

✅ **Kontrol:** Variables listesinde `JWT_REFRESH_SECRET` görünmeli (JWT_SECRET'dan farklı olmalı!)

---

## 4️⃣ NODE_ENV - Environment Mode

1. Railway Dashboard → **Variables** sekmesi
2. **+ New Variable** butonuna tıklayın
3. **Variable Name:** `NODE_ENV`
4. **Variable Value:** `production` (tam olarak küçük harflerle)
5. **Add** butonuna tıklayın

**Örnek:**
```
Variable Name: NODE_ENV
Variable Value: production
```

✅ **Kontrol:** Variables listesinde `NODE_ENV = production` görünmeli

---

## 5️⃣ PORT - Application Port

1. Railway Dashboard → **Variables** sekmesi
2. **+ New Variable** butonuna tıklayın
3. **Variable Name:** `PORT`
4. **Variable Value:** `4000` (sadece sayı, tırnak yok)
5. **Add** butonuna tıklayın

**Örnek:**
```
Variable Name: PORT
Variable Value: 4000
```

**Not:** Railway otomatik olarak PORT'u set eder, ama belirtmek best practice'dir.

✅ **Kontrol:** Variables listesinde `PORT = 4000` görünmeli

---

## 6️⃣ API_PREFIX - API Route Prefix

1. Railway Dashboard → **Variables** sekmesi
2. **+ New Variable** butonuna tıklayın
3. **Variable Name:** `API_PREFIX`
4. **Variable Value:** `api/v1` (tam olarak böyle, tırnak yok)
5. **Add** butonuna tıklayın

**Örnek:**
```
Variable Name: API_PREFIX
Variable Value: api/v1
```

**Ne işe yarar?**
- Tüm API endpoint'leri `/api/v1/` prefix'i ile çalışır
- Örnek: `https://your-backend.railway.app/api/v1/health`
- Örnek: `https://your-backend.railway.app/api/v1/auth/register`

✅ **Kontrol:** Variables listesinde `API_PREFIX = api/v1` görünmeli

---

## 7️⃣ CORS_ORIGIN - Cross-Origin Resource Sharing

**⏱️ ÖNEMLİ:** Bu değişkeni Vercel deploy sonrası ekleyeceksiniz!

### Adım 1: Vercel Deploy Sonrası Frontend URL Alın

1. Vercel'da frontend deploy edin
2. Deploy tamamlandığında frontend URL'inizi alın
3. Örnek: `https://menuqr.vercel.app` veya `https://menuqr-git-main.vercel.app`

### Adım 2: Railway'a Ekleme

1. Railway Dashboard → **Variables** sekmesi
2. **+ New Variable** butonuna tıklayın
3. **Variable Name:** `CORS_ORIGIN`
4. **Variable Value:** Frontend URL'inizi yapıştırın (https ile başlamalı)
5. **Add** butonuna tıklayın

**Örnek (Tek URL):**
```
Variable Name: CORS_ORIGIN
Variable Value: https://menuqr.vercel.app
```

**Örnek (Çoklu URL - Opsiyonel):**
Eğer preview URL'leri de eklemek isterseniz, virgülle ayırın:

```
Variable Name: CORS_ORIGIN
Variable Value: https://menuqr.vercel.app,https://menuqr-git-main.vercel.app
```

**ÖNEMLİ:**
- Railway otomatik olarak redeploy edecek (30-60 saniye)
- Deploy tamamlanana kadar bekleyin

✅ **Kontrol:** Variables listesinde `CORS_ORIGIN` görünmeli ve Railway redeploy olmalı

---

## 📋 Tüm Environment Variables Kontrol Listesi

Railway Dashboard → **Variables** sekmesinde şunların **HEPSİ** olmalı:

| Variable Name | Örnek Value | Zorunlu | Durum |
|--------------|-------------|---------|-------|
| `DATABASE_URL` | `postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | ✅ Evet | [ ] |
| `JWT_SECRET` | `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456` | ✅ Evet | [ ] |
| `JWT_REFRESH_SECRET` | `9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba` | ✅ Evet | [ ] |
| `NODE_ENV` | `production` | ✅ Evet | [ ] |
| `PORT` | `4000` | ✅ Evet | [ ] |
| `API_PREFIX` | `api/v1` | ✅ Evet | [ ] |
| `CORS_ORIGIN` | `https://menuqr.vercel.app` | ✅ Evet (Vercel sonrası) | [ ] |

**Opsiyonel:**

| Variable Name | Örnek Value | Opsiyonel |
|--------------|-------------|-----------|
| `REDIS_URL` | `redis://default:[PASSWORD]@[HOST]:6379` | ⭕ |
| `THROTTLE_TTL` | `60` | ⭕ |
| `THROTTLE_LIMIT` | `100` | ⭕ |

---

## 🎯 Hızlı Kontrol

Railway Dashboard → Variables sekmesinde şunları kontrol edin:

```
✅ DATABASE_URL (uzun postgresql://... string)
✅ JWT_SECRET (64 karakter hex string)
✅ JWT_REFRESH_SECRET (64 karakter hex string - farklı)
✅ NODE_ENV = production
✅ PORT = 4000
✅ API_PREFIX = api/v1
✅ CORS_ORIGIN = https://... (Vercel sonrası)
```

---

## 🔄 Railway Deploy Otomatik

Her environment variable eklendiğinde veya güncellendiğinde:

1. Railway otomatik olarak redeploy başlatır
2. **Deployments** sekmesinde yeni deployment görünür
3. Deployment tamamlanana kadar bekleyin (genellikle 2-3 dakika)

**Kontrol:**
- **Deployments** sekmesine gidin
- Son deployment'ın durumunu kontrol edin
- "Deployed successfully" görünene kadar bekleyin

---

## 🧪 Test Etme

Deployment tamamlandıktan sonra:

### Health Check

Tarayıcıda veya curl ile:

```
https://your-backend.railway.app/api/v1/health
```

**Beklenen Cevap:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "CafeQR API"
}
```

### API Docs

```
https://your-backend.railway.app/api/docs
```

Swagger UI açılmalı!

---

## 🐛 Yaygın Hatalar ve Çözümleri

### ❌ "Invalid connection string" Hatası

**Sorun:** DATABASE_URL yanlış formatlanmış

**Çözüm:**
1. Supabase Dashboard'dan connection string'i tekrar kopyalayın
2. Password'un doğru olduğundan emin olun
3. Port'un 6543 olduğundan emin olun (connection pooling)
4. `?pgbouncer=true` parametresinin olduğundan emin olun

### ❌ "JWT secret is too weak" Hatası

**Sorun:** JWT_SECRET çok kısa veya zayıf

**Çözüm:**
1. Yeni 64 karakterlik hex string oluşturun
2. Railway'da güncelleyin
3. Redeploy edin

### ❌ "CORS error" Hatası

**Sorun:** CORS_ORIGIN yanlış veya eksik

**Çözüm:**
1. CORS_ORIGIN değerinin tam olarak frontend URL'inizle eşleştiğinden emin olun
2. `http://` vs `https://` kontrol edin
3. `www.` vs `non-www` kontrol edin
4. Railway'da redeploy yapın

### ❌ Environment Variable Görünmüyor

**Sorun:** Variable kaydedilmemiş

**Çözüm:**
1. Variables sekmesinde tekrar kontrol edin
2. **Add** butonuna tıkladığınızdan emin olun
3. Sayfayı yenileyin

---

## ✅ Tamamlandı!

Tüm environment variables eklendikten sonra:

1. ✅ Railway otomatik deploy edecek
2. ✅ Deployment logs'u kontrol edin
3. ✅ Health check yapın
4. ✅ API docs'u kontrol edin

**Artık backend'iniz hazır!** 🎉

---

## 📞 Yardım

Sorun yaşarsanız:

1. Railway → **Deployments** → Logs kontrol edin
2. Environment variables'ları tekrar kontrol edin
3. Supabase connection string'i kontrol edin
4. JWT secrets'ları kontrol edin

**Sonraki Adım:** Vercel'da frontend deploy edin! 🚀

