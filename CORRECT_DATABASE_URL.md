# ✅ Doğru DATABASE_URL - Supabase Yeni Format

## 📋 Vercel'da Ekleyeceğiniz DATABASE_URL

**Vercel Dashboard → Project Settings → Environment Variables → DATABASE_URL**

### Değer:

```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@db.wczfwumhfhuwdrbhyujr.supabase.co:5432/postgres
```

**Önemli:**
- Hostname: `db.wczfwumhfhuwdrbhyujr.supabase.co` ✅ (Supabase yeni formatı)
- Port: `5432` (direct connection)
- Password: `Ypfmqcz0.Qr`
- `?pgbouncer=true` parametresi YOK

---

## 🔄 Vercel'da Güncelleme

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. `DATABASE_URL` değişkenini bulun
3. **Edit** butonuna tıklayın
4. Yukarıdaki connection string'i yapıştırın:
   ```
   postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@db.wczfwumhfhuwdrbhyujr.supabase.co:5432/postgres
   ```
5. **Save** butonuna tıklayın
6. Vercel otomatik redeploy edecek

---

## ✅ Test

Redeploy sonrası:
1. Frontend URL'inize gidin
2. **Register** sayfasına gidin
3. Yeni kullanıcı oluşturun
4. Artık çalışmalı! ✅

---

## 🎉 Tamamlandı!

Bu connection string ile database bağlantısı çalışmalı! 🚀

