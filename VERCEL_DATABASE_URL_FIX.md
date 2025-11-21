# 🔧 Vercel DATABASE_URL - Hızlı Düzeltme

## ❌ Hata

```
Can't reach database server at `db.wczfwumhfhuwdrbhyujr.supabase.co:5432`
```

**Sebep:** Hostname yanlış format.

## ✅ Çözüm: Doğru Connection String

### Vercel'da DATABASE_URL Güncelle

**Vercel Dashboard → Project Settings → Environment Variables → DATABASE_URL**

**Değeri şu şekilde güncelleyin:**

```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Önemli:**
- Hostname: `aws-0-eu-central-1.pooler.supabase.com` (pooler hostname)
- Port: `5432` (direct connection)
- Password: `Ypfmqcz0.Qr`
- `?pgbouncer=true` parametresi YOK

---

## 🔍 Region Kontrolü

Eğer `eu-central-1` çalışmazsa:

1. Supabase Dashboard → Settings → Database
2. Connection String → URI
3. Hostname'deki region'ı kontrol edin
4. Örnek: `aws-0-us-east-1.pooler.supabase.com`

**Region'ı değiştirin:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-[DOĞRU_REGION].pooler.supabase.com:5432/postgres
```

---

## 📋 Adım Adım

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. `DATABASE_URL` değişkenini bulun
3. **Edit** butonuna tıklayın
4. Yukarıdaki connection string'i yapıştırın
5. Region'ı kontrol edin (gerekirse değiştirin)
6. **Save** butonuna tıklayın
7. Vercel otomatik redeploy edecek

---

## ✅ Test

Redeploy sonrası:
1. Frontend URL'inize gidin
2. **Register** sayfasına gidin
3. Yeni kullanıcı oluşturun
4. Artık çalışmalı! ✅

---

## 🎉 Tamamlandı!

DATABASE_URL'i yukarıdaki formatla güncelleyin. Artık çalışmalı! 🚀

