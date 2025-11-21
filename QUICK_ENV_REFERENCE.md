# ⚡ Environment Variables - Hızlı Referans

## 🎯 Railway Variables Sekmesi - Hızlı Ekleme

Railway Dashboard → **Variables** → **+ New Variable**

---

## 1️⃣ DATABASE_URL

**Değer:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Nasıl Alınır:**
1. Supabase Dashboard → Settings → Database
2. Database Password alın
3. Connection String → Connection Pooling → Session mode → URI
4. `[PASSWORD]` ve `[REGION]` kısımlarını doldurun

**Örnek:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:MyPass123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 2️⃣ JWT_SECRET

**Komut (Terminal'de):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Değer Formatı:**
- 64 karakter hex string (0-9, a-f)
- Örnek: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

**ÖNEMLİ:** Güçlü ve rastgele olmalı!

---

## 3️⃣ JWT_REFRESH_SECRET

**Komut (Terminal'de):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Değer Formatı:**
- 64 karakter hex string (JWT_SECRET'tan FARKLI olmalı!)
- Örnek: `9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba`

**ÖNEMLİ:** JWT_SECRET'tan farklı olmalı!

---

## 4️⃣ NODE_ENV

**Değer:**
```
production
```

**Not:** Küçük harflerle, tırnak yok

---

## 5️⃣ PORT

**Değer:**
```
4000
```

**Not:** Sadece sayı, tırnak yok

---

## 6️⃣ API_PREFIX

**Değer:**
```
api/v1
```

**Not:** Küçük harflerle, tırnak yok, slash ile

---

## 7️⃣ CORS_ORIGIN

**Değer (Vercel deploy sonrası):**
```
https://menuqr.vercel.app
```

**Not:** 
- Vercel deploy sonrası ekleyin
- Frontend URL'inizi yapıştırın
- `https://` ile başlamalı

---

## 📋 Tüm Variables Özeti (Kopyala-Yapıştır)

Railway Dashboard → Variables → Her biri için **+ New Variable**:

| Name | Value | Notlar |
|------|-------|--------|
| `DATABASE_URL` | `postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase'den al |
| `JWT_SECRET` | `[64 karakter hex]` | Komutla oluştur |
| `JWT_REFRESH_SECRET` | `[64 karakter hex - farklı]` | Komutla oluştur |
| `NODE_ENV` | `production` | |
| `PORT` | `4000` | |
| `API_PREFIX` | `api/v1` | |
| `CORS_ORIGIN` | `https://menuqr.vercel.app` | Vercel sonrası |

---

## ✅ Kontrol Listesi

- [ ] DATABASE_URL eklendi
- [ ] JWT_SECRET eklendi (64 karakter)
- [ ] JWT_REFRESH_SECRET eklendi (64 karakter, farklı)
- [ ] NODE_ENV = production eklendi
- [ ] PORT = 4000 eklendi
- [ ] API_PREFIX = api/v1 eklendi
- [ ] CORS_ORIGIN eklendi (Vercel sonrası)

---

## 🚀 Sonraki Adım

Tüm variables eklendikten sonra:
1. Railway otomatik deploy edecek
2. Health check: `https://your-backend.railway.app/api/v1/health`
3. API Docs: `https://your-backend.railway.app/api/docs`

---

**Detaylı rehber için:** [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md)

