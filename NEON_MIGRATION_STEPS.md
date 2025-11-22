# 🗄️ Neon Database Migration - Adım Adım

## ⚠️ ÖNEMLİ: Migration Çalıştırılmalı!

Register hatası muhtemelen database'de tablolar olmadığı için. Neon'da Prisma migration çalıştırmalıyız.

---

## 📋 Migration Adımları

### 1. Local'de DATABASE_URL Set Edin

**Terminal'de:**

```bash
cd frontend

# DATABASE_URL'i set edin
export DATABASE_URL="postgresql://neondb_owner:npg_INgQBwD0rXz4@ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Windows PowerShell'de:**
```powershell
cd frontend
$env:DATABASE_URL="postgresql://neondb_owner:npg_INgQBwD0rXz4@ep-late-snow-agn9hz8s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 2. Prisma Migration Çalıştırın

```bash
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

**Veya:**

```bash
npx prisma db push --schema=./prisma/schema.prisma
```

**Fark:**
- `migrate deploy`: Migration dosyaları kullanır (production için)
- `db push`: Schema'yı direkt database'e push eder (hızlı, development için)

### 3. Prisma Client Generate

```bash
npx prisma generate --schema=./prisma/schema.prisma
```

---

## 🔄 Alternatif: Neon Dashboard'dan SQL

Eğer migration çalışmazsa, Neon Dashboard'dan direkt SQL çalıştırabilirsiniz:

1. **Neon Dashboard** → Database → **SQL Editor**
2. Prisma schema'dan SQL oluşturun veya migration SQL'ini çalıştırın

---

## ✅ Migration Sonrası Test

### 1. Database Test

```
https://menu-qr-frontend.vercel.app/api/v1/test-db
```

### 2. Register Sayfası

```
https://menu-qr-frontend.vercel.app/auth/register
```

Yeni kullanıcı oluşturmayı deneyin.

---

## 🆘 Sorun Giderme

### Migration Hatası

Eğer migration çalışmazsa:

```bash
# Prisma client generate edin
npx prisma generate --schema=./prisma/schema.prisma

# Database push deneyin (migration yerine)
npx prisma db push --schema=./prisma/schema.prisma
```

### Connection Hatası

Eğer connection hatası alırsanız:

1. DATABASE_URL'in doğru olduğundan emin olun
2. Neon Dashboard → Database → Connection string'i kontrol edin
3. SSL mode'un `require` olduğundan emin olun

---

## 📋 Özet

1. ✅ Local'de DATABASE_URL set edin
2. ✅ `npx prisma migrate deploy` veya `npx prisma db push` çalıştırın
3. ✅ Register sayfasını test edin

**Migration çalıştırdıktan sonra register çalışmalı!** 🚀

