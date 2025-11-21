# 🔧 Supabase Direct Connection - Doğru Format

## ❌ Sorun

"Tenant or user not found" hatası devam ediyor.

**Sebep:** Connection pooling (pgbouncer) Prisma ile uyumsuz.

## ✅ Çözüm: Supabase Direct Connection

Supabase Dashboard'dan **Direct Connection** string'ini alın (Connection Pooling değil!).

---

## 📍 Supabase Dashboard'dan Direct Connection Alma

### Adım 1: Supabase Dashboard'a Gidin

1. https://supabase.com/dashboard/project/wczfwumhfhuwdrbhyujr/settings/database
2. VEYA: Supabase Dashboard → **Settings** → **Database**

### Adım 2: Direct Connection String'i Alın

1. **Connection String** bölümüne gidin
2. **URI** tab'ını seçin (Connection Pooling değil!)
3. **Direct Connection** string'ini kopyalayın

**Format:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

VEYA (Supabase'in yeni formatı):
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:[PASSWORD]@[HOST]:5432/postgres
```

**Önemli:**
- Port: **5432** (direct connection)
- **Connection Pooling değil!**
- `?pgbouncer=true` parametresi YOK

---

## 🔄 Vercel'da Güncelleme

### Adım 1: Supabase'den Direct Connection String'i Alın

1. Supabase Dashboard → Settings → Database
2. **Connection String** → **URI** (Direct Connection)
3. String'i kopyalayın
4. `[PASSWORD]` kısmını `Ypfmqcz0.Qr` ile değiştirin

### Adım 2: Vercel'da Güncelle

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. `DATABASE_URL` değişkenini bulun
3. **Edit** butonuna tıklayın
4. Yeni direct connection string'ini yapıştırın
5. **Save** butonuna tıklayın

### Adım 3: Redeploy

1. Vercel otomatik redeploy edecek
2. VEYA: Deployments → Son deployment → **Redeploy**

---

## 📋 Örnek Direct Connection String

**Format:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST]:5432/postgres
```

**Sizin için (Password: Ypfmqcz0.Qr):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**VEYA (Supabase'in yeni formatı - kontrol edin):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@db.wczfwumhfhuwdrbhyujr.supabase.co:5432/postgres
```

---

## 🔍 Hostname Kontrolü

Supabase Dashboard'da direct connection string'inde hostname şunlardan biri olabilir:

1. `aws-0-[REGION].pooler.supabase.com:5432` (Eski format)
2. `db.[PROJECT_REF].supabase.co:5432` (Yeni format)

**Her ikisi de çalışır, ama Supabase Dashboard'da gösterilen formatı kullanın!**

---

## ✅ Test

Redeploy sonrası:
1. Frontend URL'inize gidin
2. **Register** sayfasına gidin
3. Yeni kullanıcı oluşturun
4. Artık çalışmalı! ✅

---

## 🐛 Hala Hata Alırsanız

1. **Supabase Dashboard** → Settings → Database → Connection String
2. **Direct Connection** (URI) string'ini kopyalayın
3. Password'u (`Ypfmqcz0.Qr`) manuel olarak ekleyin
4. Vercel'da güncelleyin
5. Redeploy edin

**Önemli:** Supabase Dashboard'da gösterilen **tam formatı** kullanın!

---

## 🎉 Tamamlandı!

Direct connection string'i Supabase Dashboard'dan alıp Vercel'da güncelleyin. Artık çalışmalı! 🚀

