# 🔧 "Tenant or user not found" Hatası - Çözüm

## ❌ Sorun

Hata: `Error querying the database: FATAL: Tenant or user not found`

**İyi Haber:** Database'e bağlantı yapılabiliyor! ✅

**Kötü Haber:** Connection pooling (pgbouncer) ile Prisma uyumsuzluğu var.

---

## ✅ ÇÖZÜM - Connection String'i Güncelle

### "Tenant or user not found" Hatası Nedir?

Bu hata Supabase'de **pgbouncer transaction mode** kullanırken Prisma'nın bazı query'leri çalıştıramamasından kaynaklanıyor.

---

## 🔧 Vercel'da DATABASE_URL Güncelleme

### Vercel Dashboard → Settings → Environment Variables → DATABASE_URL

### ✅ DOĞRU FORMAT (Connection Pooling - Transaction Mode, pgbouncer OLMADAN):

```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**ÖNEMLİ:**
- ✅ Port: `5432` (Transaction mode)
- ✅ Hostname: `aws-0-eu-central-1.pooler.supabase.com`
- ❌ `?pgbouncer=true` parametresi **YOK**
- ❌ `&connection_limit=1` parametresi **YOK**

**Neden?** Prisma, pgbouncer transaction mode ile bazı query'lerde sorun yaşıyor. Parametreleri kaldırarak connection pooling URL'i direkt connection gibi kullanıyoruz.

---

## 🔄 Alternatif: Direct Connection (En Güvenilir)

Eğer yukarıdaki çalışmazsa, **direct connection** kullanın:

### Supabase Dashboard'dan Direct Connection String Alın:

1. **Supabase Dashboard** → https://supabase.com/dashboard/project/wczfwumhfhuwdrbhyujr
2. **Settings** → **Database**
3. **Connection String** → **Direct Connection** (Connection Pooling değil!)
4. Connection string'i kopyalayın
5. Password'ü (`Ypfmqcz0.Qr`) ekleyin

**Format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Sizin için (eğer direct connection hostname'i farklıysa):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@[HOSTNAME_FROM_SUPABASE]:5432/postgres
```

**Önemli:** Supabase Dashboard'dan direkt olarak aldığınız connection string'i kullanın!

---

## 📋 Adım Adım

### 1. Vercel'da DATABASE_URL'i Güncelleyin

1. **Vercel Dashboard** → Projenizi seçin
2. **Settings** → **Environment Variables**
3. `DATABASE_URL` değişkenini bulun
4. **Edit** butonuna tıklayın

### 2. YENİ Değeri Ekleyin

**Seçenek 1 - Connection Pooling (pgbouncer OLMADAN):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Seçenek 2 - Direct Connection (Supabase Dashboard'dan alın):**
1. Supabase Dashboard → Settings → Database → Direct Connection
2. Connection string'i kopyalayın
3. Password'ü ekleyin

### 3. Parametreleri Kaldırın

**ESKİ (YANLIŞ):**
```
postgresql://...@pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

**YENİ (DOĞRU):**
```
postgresql://...@pooler.supabase.com:5432/postgres
```

**Veya Direct Connection:**
```
postgresql://...@db.[PROJECT_REF].supabase.co:5432/postgres
```

### 4. Save ve Redeploy

1. **Save** butonuna tıklayın
2. **Deployments** → **Redeploy** yapın
3. Veya yeni commit push edin

---

## 🧪 Test

### 1. Database URL Kontrolü

```
https://your-app.vercel.app/api/v1/check-db-url
```

**Beklenen:**
- `hasPgbouncer: false` (pgbouncer parametresi yok)
- `correctFormat: true`

### 2. Database Bağlantısı Test

```
https://your-app.vercel.app/api/v1/test-db
```

**Beklenen:**
```json
{
  "status": "success",
  "message": "Database connection successful"
}
```

### 3. Register Sayfası

1. Frontend URL'inize gidin
2. **Register** sayfasına gidin
3. Yeni kullanıcı oluşturun
4. ✅ **Artık çalışmalı!**

---

## 🔍 Sorun Giderme

### Hala "Tenant or user not found" Hatası Alıyorsanız

1. **Supabase Dashboard** → Settings → Database → **Direct Connection**
2. Connection string'i kopyalayın
3. Vercel'da `DATABASE_URL`'i bu direct connection string ile değiştirin
4. Redeploy yapın

### Direct Connection String Formatı

Supabase Dashboard'dan aldığınız connection string şu formatta olmalı:

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOSTNAME]:5432/postgres
```

**Örnek:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@db.wczfwumhfhuwdrbhyujr.supabase.co:5432/postgres
```

**ÖNEMLİ:** Supabase Dashboard'dan direkt aldığınız connection string'i kullanın!

---

## ✅ Doğru Format Özeti

### Seçenek 1: Connection Pooling (pgbouncer OLMADAN)
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

### Seçenek 2: Direct Connection (Supabase Dashboard'dan)
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@[HOSTNAME_FROM_SUPABASE]:5432/postgres
```

**Her ikisinde de:**
- ❌ `?pgbouncer=true` parametresi **YOK**
- ❌ `&connection_limit=1` parametresi **YOK**
- ✅ Port: `5432`
- ✅ Protocol: `postgresql://` (postgres:// değil!)

---

## 🎯 Sonuç

1. Vercel'da `DATABASE_URL`'i yukarıdaki format ile güncelleyin (pgbouncer parametreleri OLMADAN)
2. Save → Redeploy
3. `/api/v1/test-db` endpoint'ini test edin
4. Register sayfasını test edin

**Artık çalışmalı!** ✅

