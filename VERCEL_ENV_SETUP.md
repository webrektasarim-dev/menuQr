# 🔧 Vercel Environment Variables - Hazır Değerler

## 📋 Vercel'da Ekleyeceğiniz Environment Variables

Vercel Dashboard → Project Settings → Environment Variables

Aşağıdaki variables'ları **HEPSİNİ** ekleyin:

---

## ✅ 1. DATABASE_URL

**Variable Name:** `DATABASE_URL`

**Variable Value (Direct Connection - Önerilen):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Önemli Notlar:**
- Password: `Ypfmqcz0.Qr`
- Region: `eu-central-1` (Supabase Dashboard'dan kontrol edin)
- Port: `5432` (Direct Connection - Prisma ile uyumlu)
- **Connection pooling KULLANILMIYOR** (Prisma ile uyumsuzluk nedeniyle)

**Alternatif (Connection Pooling - Deneyebilirsiniz):**
```
postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Tavsiye:** Direct connection (port 5432) kullanın - daha güvenilir!

**Region'ı Kontrol Etmek İçin:**
1. Supabase Dashboard → Settings → Database
2. Connection String → Connection Pooling
3. Region'ı kontrol edin (eğer farklıysa yukarıdaki `eu-central-1` kısmını değiştirin)

---

## ✅ 2. JWT_SECRET

**Variable Name:** `JWT_SECRET`

**Variable Value:**
```
08d39d99b43dfac3af81e0579a1ca780e81468c5cda98571cf1eacc194416c18
```

**Önemli:**
- 64 karakter hex string
- Güçlü ve rastgele
- Production'da değiştirmeyin!

---

## ✅ 3. JWT_REFRESH_SECRET

**Variable Name:** `JWT_REFRESH_SECRET`

**Variable Value:**
```
5e9196a85127875672feae255355c039e2361e65a16591f207829d0aa0c1101e
```

**Önemli:**
- JWT_SECRET'tan **FARKLI** olmalı
- 64 karakter hex string

---

## ✅ 4. NEXT_PUBLIC_API_URL

**Variable Name:** `NEXT_PUBLIC_API_URL`

**Variable Value:**
```
/api/v1
```

**Önemli:**
- Relative path olarak `/api/v1` kullanın
- Vercel otomatik olarak doğru domain'e yönlendirir
- **Production, Preview ve Development için aynı değer**

---

## ⭕ 5. JWT_EXPIRES_IN (Opsiyonel)

**Variable Name:** `JWT_EXPIRES_IN`

**Variable Value:**
```
7d
```

**Not:** Opsiyonel, varsayılan değer zaten `7d`

---

## ⭕ 6. NODE_ENV (Opsiyonel)

**Variable Name:** `NODE_ENV`

**Variable Value:**
```
01:50:49.633 
```

**Not:** Vercel otomatik olarak set eder, ama belirtmek iyidir

---

## 📋 Hızlı Kopyala-Yapıştır Listesi

Vercel Dashboard'da **Variables** sekmesinde şunları ekleyin:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.wczfwumhfhuwdrbhyujr:Ypfmqcz0.Qr@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview, Development |
| `JWT_SECRET` | `08d39d99b43dfac3af81e0579a1ca780e81468c5cda98571cf1eacc194416c18` | Production, Preview, Development |
| `JWT_REFRESH_SECRET` | `5e9196a85127875672feae255355c039e2361e65a16591f207829d0aa0c1101e` | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | Production, Preview, Development |
| `JWT_EXPIRES_IN` | `7d` | Production, Preview, Development (Opsiyonel) |
| `NODE_ENV` | `production` | Production, Preview, Development (Opsiyonel) |

---

## ✅ Adım Adım Ekleme

### Vercel Dashboard'da:

1. **Vercel Dashboard** → Projenize gidin
2. **Settings** sekmesine tıklayın
3. **Environment Variables** sekmesine tıklayın
4. **Add New** butonuna tıklayın
5. **Variable Name** ve **Value** ekleyin
6. **Environment** seçin (Production, Preview, Development - HEPSİNİ seçin)
7. **Save** butonuna tıklayın

**Her variable için tekrar edin!**

---

## 🔄 Deploy Sonrası

Environment variables ekledikten sonra:

1. Vercel otomatik olarak **Redeploy** edecek
2. Deploy tamamlanana kadar bekleyin (2-3 dakika)
3. Deploy logs'u kontrol edin
4. Test edin!

---

## 🐛 Sorun Giderme

### "DATABASE_URL not found" Hatası

**Çözüm:**
1. Environment variable'ın doğru eklendiğinden emin olun
2. Production, Preview, Development için hepsini eklediğinizden emin olun
3. Redeploy yapın

### "Invalid connection string" Hatası

**Çözüm:**
1. DATABASE_URL formatını kontrol edin
2. Password doğru mu? (`Ypfmqcz0.Qr`)
3. Region doğru mu? (`eu-central-1` - Supabase Dashboard'dan kontrol edin)
4. Port `6543` mü? (connection pooling için)

### "JWT secret is too weak" Hatası

**Çözüm:**
- JWT_SECRET 64 karakter olmalı
- Yukarıdaki değerleri kullanın

---

## ✅ Kontrol Listesi

- [ ] DATABASE_URL eklendi (password: `Ypfmqcz0.Qr`)
- [ ] JWT_SECRET eklendi
- [ ] JWT_REFRESH_SECRET eklendi (farklı olmalı)
- [ ] NEXT_PUBLIC_API_URL = `/api/v1` eklendi
- [ ] Tüm variables Production, Preview, Development için eklendi
- [ ] Deploy tamamlandı
- [ ] Test edildi

---

## 🎉 Tamamlandı!

Tüm environment variables eklendikten sonra sisteminiz hazır! 🚀

**Sonraki Adım:** Vercel'da deploy edin ve test edin!

