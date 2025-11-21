# 🔧 Database Connection Hatası - Çözüm

## ❌ Sorun

Kayıt olurken hata:
```
Error querying the database: FATAL: Tenant or user not found
```

Bu hata Supabase connection pooling ile Prisma arasındaki uyumsuzluktan kaynaklanıyor.

## ✅ Çözüm

### 1. Connection String Formatı

Supabase connection pooling için **Transaction mode** kullanılmalı (Session mode değil).

**Vercel Environment Variables'da:**

```
DATABASE_URL=postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Önemli:**
- `?pgbouncer=true` - Connection pooling aktif
- `&connection_limit=1` - Prisma için gerekli (her connection için 1 limit)

### 2. Direct URL (Opsiyonel - Migration için)

Eğer migration çalıştırmanız gerekirse, direct connection URL'i de ekleyin:

```
DIRECT_DATABASE_URL=postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Not:** Direct URL port **5432** (pooling değil, direct connection)

---

## 🔄 Vercel'da Güncelleme

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. `DATABASE_URL` değişkenini bulun
3. Değeri güncelleyin:
   ```
   postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
4. **Save** butonuna tıklayın
5. Vercel otomatik redeploy edecek

---

## 🧪 Test

Redeploy sonrası:
1. Frontend URL'inize gidin
2. **Register** sayfasına gidin
3. Yeni kullanıcı oluşturun
4. Artık çalışmalı! ✅

---

## 📋 Connection String Kontrolü

**Doğru Format:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Yanlış Format (Session mode - Prisma ile çalışmaz):**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Fark:** `&connection_limit=1` parametresi eklendi!

---

## ✅ Tamamlandı!

Connection string güncellendi. Artık kayıt işlemi çalışmalı! 🎉

