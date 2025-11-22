# ⚠️ ÖNEMLİ: Vercel'da DATABASE_URL Güncelleme

## ❌ Sorun

Hata mesajında hala **Supabase connection string** görünüyor:
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@***
```

**Sebep:** Vercel'da `DATABASE_URL` hala Supabase connection string'i. Neon connection string'i ile güncellenmemiş!

---

## ✅ ÇÖZÜM - Vercel'da DATABASE_URL Güncelleme

### 1. Vercel Dashboard'a Gidin

1. **Vercel Dashboard** → Projeniz → **Settings** → **Environment Variables**
2. `DATABASE_URL` değişkenini bulun
3. **Edit** butonuna tıklayın

### 2. ESKİ Değeri Silin

**ESKİ (SUPABASE - SİLİN):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@db.wczfwumhfhuwdrbhyujr.supabase.co:5432/postgres
```

veya

```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

### 3. YENİ Değeri Ekleyin (NEON)

**YENİ (NEON - EKLEYİN):**
```
postgresql://neondb_owner:npg_INgQBwD0rXz4@ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Önemli:**
- ✅ Hostname: `ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech` (Neon)
- ✅ Database: `neondb`
- ✅ SSL Mode: `require`
- ✅ Channel Binding: `require`

### 4. Environment Seçin

- **Environment:** `Production` (veya `All`)
- ✅ **Save** butonuna tıklayın

### 5. Redeploy Yapın

1. **Deployments** → Son deployment'ın yanındaki **⋯** → **Redeploy**
2. Veya yeni commit push edin (otomatik redeploy)

---

## 🧪 Test

### 1. Database URL Kontrolü

Deploy sonrası:
```
https://menu-qr-frontend.vercel.app/api/v1/check-db-url
```

**Beklenen:**
- `hostname: "ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech"` ✅ (Neon)
- `correctFormat: true` ✅

### 2. Database Bağlantısı Test

```
https://menu-qr-frontend.vercel.app/api/v1/test-db
```

**Beklenen:**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "test": [{"test": 1}],
  "databaseUrl": "postgresql://neondb_owner:***@***"
}
```

**Artık "Tenant or user not found" hatası olmamalı!** ✅

---

## 📋 Özet

1. ✅ Vercel'da `DATABASE_URL`'i **Neon connection string** ile güncelleyin
2. ✅ ESKİ Supabase connection string'i **SİLİN**
3. ✅ YENİ Neon connection string'i **EKLEYİN**
4. ✅ Save → Redeploy
5. ✅ Test edin

**Artık çalışmalı!** 🚀

---

## ⚠️ Önemli Not

Eğer hala Supabase connection string görünüyorsa:
- Vercel'da `DATABASE_URL` güncellenmemiş demektir
- **Mutlaka Vercel Dashboard'dan kontrol edin**
- Environment variable'ın doğru environment'da (Production) olduğundan emin olun

