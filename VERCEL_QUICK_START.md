# ⚡ Vercel Quick Start - 5 Dakika

## 🚀 Hızlı Deployment

### 1️⃣ Vercel Proje Oluştur (2 dakika)

1. https://vercel.com → **Add New Project**
2. GitHub repo seç: `webrektasarim-dev/menuQr`
3. **Root Directory:** `frontend` olarak ayarla
4. **Continue** → **Deploy** (önce env vars ekle!)

### 2️⃣ Environment Variables Ekle (2 dakika)

**Vercel Dashboard → Settings → Environment Variables → Add New**

Aşağıdakileri **HEPSİNİ** ekleyin (Production, Preview, Development):

```
DATABASE_URL=postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true

JWT_SECRET=08d39d99b43dfac3af81e0579a1ca780e81468c5cda98571cf1eacc194416c18

JWT_REFRESH_SECRET=5e9196a85127875672feae255355c039e2361e65a16591f207829d0aa0c1101e

NEXT_PUBLIC_API_URL=/api/v1
```

**Önemli:** Her variable'ı Production, Preview ve Development için ekleyin!

### 3️⃣ Deploy (1 dakika)

1. Environment variables eklendikten sonra Vercel otomatik **Redeploy** edecek
2. Deploy tamamlanana kadar bekleyin
3. **Done!** ✅

---

## ✅ Test

1. Frontend URL'inize gidin: `https://your-app.vercel.app`
2. **Register** sayfasına gidin
3. Yeni işletme oluşturun
4. **Test et!** 🎉

---

## 🔍 Region Kontrolü

Eğer `DATABASE_URL` connection hatası alırsanız:

1. Supabase Dashboard → Settings → Database
2. Connection String → Connection Pooling
3. Region'ı kontrol edin
4. `eu-central-1` yerine doğru region'ı yazın

**Örnek farklı region:**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 📋 Checklist

- [ ] Vercel'da proje oluşturuldu
- [ ] Root directory `frontend` olarak ayarlandı
- [ ] DATABASE_URL eklendi (password: `Ypfmqcz0.Qr`)
- [ ] JWT_SECRET eklendi
- [ ] JWT_REFRESH_SECRET eklendi
- [ ] NEXT_PUBLIC_API_URL = `/api/v1` eklendi
- [ ] Tüm variables Production, Preview, Development için eklendi
- [ ] Deploy tamamlandı
- [ ] Test edildi

---

## 🎉 Hazır!

Artık sisteminiz Vercel'da çalışıyor! 🚀

**Detaylı rehber için:** [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

