# ⚠️ ACİL: Vercel'da DATABASE_URL Kontrolü

## ❌ Sorun

Hata: `Can't reach database server at localhost:5432`

**Sebep:** Vercel'da `DATABASE_URL` hala placeholder veya yanlış değer!

---

## ✅ ÇÖZÜM - Vercel'da DATABASE_URL Kontrolü

### Vercel Dashboard → Settings → Environment Variables → DATABASE_URL

### ❌ YANLIŞ (placeholder veya localhost):
```
postgresql://placeholder:placeholder@localhost:5432/placeholder
```

veya

```
localhost:5432
```

### ✅ DOĞRU (Neon Connection String):
```
postgresql://neondb_owner:npg_INgQBwD0rXz4@ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Önemli:**
- ✅ Hostname: `ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech` (Neon)
- ✅ Database: `neondb`
- ❌ `localhost` **YOK**
- ❌ `placeholder` **YOK**

---

## 🔄 Vercel'da Güncelleme

### 1. Vercel Dashboard'a Gidin

1. **Vercel Dashboard** → Projeniz → **Settings** → **Environment Variables**
2. `DATABASE_URL` değişkenini bulun
3. **Edit** butonuna tıklayın

### 2. Değeri Kontrol Edin

**Şu anki değer ne?** Eğer `localhost` veya `placeholder` içeriyorsa:

### 3. YENİ Değeri Ekleyin

**Variable Name:** `DATABASE_URL`

**Variable Value:**
```
postgresql://neondb_owner:npg_INgQBwD0rXz4@ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Environment:** `Production` (veya `All`)

### 4. Save ve Redeploy

1. **Save** butonuna tıklayın
2. **Deployments** → Son deployment'ın yanındaki **⋯** → **Redeploy**
3. Veya yeni commit push edildi, otomatik redeploy olacak

---

## 🧪 Test

### 1. Database URL Kontrolü

Deploy sonrası:
```
https://menu-qr-frontend.vercel.app/api/v1/check-db-url
```

**Beklenen:**
- `hostname: "ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech"` ✅
- `hostname` **"localhost" değil!** ❌

### 2. Database Bağlantısı Test

```
https://menu-qr-frontend.vercel.app/api/v1/test-db
```

**Beklenen:**
```json
{
  "status": "success",
  "message": "Database connection successful"
}
```

### 3. Register Sayfası

```
https://menu-qr-frontend.vercel.app/auth/register
```

Yeni kullanıcı oluşturmayı deneyin.

---

## 📋 Doğru Connection String

**Kopyala-Yapıştır:**
```
postgresql://neondb_owner:npg_INgQBwD0rXz4@ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Kontrol Listesi:**
- ✅ `postgresql://` ile başlıyor
- ✅ `neondb_owner` user
- ✅ `ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech` hostname
- ✅ `neondb` database
- ✅ `?sslmode=require&channel_binding=require` parametreleri
- ❌ `localhost` **YOK**
- ❌ `placeholder` **YOK**
- ❌ `psql` komutu **YOK**

---

## ✅ Sonuç

1. ✅ Vercel'da `DATABASE_URL`'i kontrol edin
2. ✅ `localhost` veya `placeholder` içeriyorsa, Neon connection string ile değiştirin
3. ✅ Save → Redeploy
4. ✅ Test edin

**Artık çalışmalı!** 🚀

