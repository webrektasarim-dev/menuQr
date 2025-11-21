# 🔄 Vercel Redeploy - Hızlı Rehber

## 🚀 Otomatik Redeploy

GitHub'a push yaptım, Vercel otomatik olarak redeploy edecek!

**Kontrol:**
1. Vercel Dashboard → Deployments
2. En son deployment'ı kontrol edin
3. "Building..." durumunu göreceksiniz

---

## 🔧 Manuel Redeploy (Alternatif)

Eğer otomatik redeploy olmazsa:

1. **Vercel Dashboard** → Projenize gidin
2. **Deployments** sekmesine tıklayın
3. En son deployment'ın yanındaki **üç nokta (...)** menüsüne tıklayın
4. **Redeploy** seçeneğini seçin
5. **Redeploy** butonuna tıklayın

---

## ⚠️ ÖNEMLİ: DATABASE_URL Güncellemesi

Redeploy'dan **ÖNCE** DATABASE_URL'i güncellediğinizden emin olun!

**Vercel Dashboard → Settings → Environment Variables:**

```
DATABASE_URL=postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Önemli:**
- Port: `5432` (direct connection)
- `?pgbouncer=true` parametresi YOK

---

## ✅ Redeploy Sonrası Kontrol

1. Build tamamlandıktan sonra
2. Frontend URL'inize gidin
3. **Register** sayfasına gidin
4. Yeni kullanıcı oluşturun
5. Artık çalışmalı! ✅

---

## 🐛 Hala Hata Alırsanız

1. **Vercel Dashboard** → Deployments → View Logs
2. Build log'larını kontrol edin
3. Runtime log'larını kontrol edin
4. DATABASE_URL doğru mu kontrol edin

---

## 🎉 Hazır!

Redeploy başladı! Build tamamlanana kadar bekleyin (2-3 dakika).

