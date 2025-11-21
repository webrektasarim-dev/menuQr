# 🔧 Database Connection Hatası - Hızlı Çözüm

## ❌ Sorun

Kayıt olurken hata:
```
Error querying the database: FATAL: Tenant or user not found
```

**Sebep:** Supabase connection pooling (pgbouncer) Transaction mode kullanıyor, Prisma Session mode gerektiriyor.

## ✅ Çözüm: Direct Connection URL Kullanın

Connection pooling yerine **direct connection** kullanın (port 5432).

### Vercel'da DATABASE_URL Güncelleme

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. `DATABASE_URL` değişkenini bulun
3. **Değeri değiştirin:**

**ESKİ (Connection Pooling - Çalışmıyor):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**YENİ (Direct Connection - Çalışıyor):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Önemli Değişiklikler:**
- Port: `6543` → `5432` (direct connection)
- `?pgbouncer=true` parametresi **KALDIRILDI**

4. **Save** butonuna tıklayın
5. Vercel otomatik redeploy edecek

---

## 📋 Direct Connection String Formatı

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Sizin için:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Not:** Region'ı Supabase Dashboard'dan kontrol edin, farklıysa değiştirin.

---

## 🔍 Region Kontrolü

1. Supabase Dashboard → Settings → Database
2. Connection String → **Direct Connection** (Connection Pooling değil!)
3. Region'ı kontrol edin
4. Port **5432** olmalı

---

## ✅ Test

Redeploy sonrası:
1. Frontend URL'inize gidin
2. **Register** sayfasına gidin
3. Yeni kullanıcı oluşturun
4. Artık çalışmalı! ✅

---

## ⚠️ Not

Direct connection kullanmak:
- ✅ Prisma ile tam uyumlu
- ✅ Tüm query'ler çalışır
- ⚠️ Connection limit daha düşük (ama Vercel serverless için yeterli)

Vercel serverless functions için direct connection yeterli ve daha güvenilir!

---

## 🎉 Tamamlandı!

DATABASE_URL'i güncelleyin ve redeploy edin. Artık çalışmalı! 🚀

