# Database Migration Deploy Rehberi

## Migration Dosyası

Migration dosyası: `frontend/prisma/migrations/20241220_add_license_and_payment/migration.sql`

## Neon Database'de Migration Çalıştırma

### Yöntem 1: Neon Console'dan

1. Neon Console'a giriş yapın
2. SQL Editor'ü açın
3. Migration dosyasının içeriğini kopyalayıp çalıştırın

### Yöntem 2: Prisma CLI ile

```bash
cd frontend
npx prisma migrate deploy
```

**NOT:** `DATABASE_URL` environment variable'ının doğru ayarlandığından emin olun.

## Migration İçeriği

- `PlanType` enum'ı güncellendi: `FREE` → `BASIC`
- `User` tablosuna eklendi:
  - `licenseExpiresAt` (TIMESTAMP)
  - `lastPaymentAt` (TIMESTAMP)
- `Payment` tablosu oluşturuldu
- Index'ler eklendi

## Kontrol

Migration başarılı olduktan sonra:

1. Neon Console'da `payments` tablosunun oluştuğunu kontrol edin
2. `users` tablosunda yeni kolonların eklendiğini kontrol edin
3. `PlanType` enum'ının `BASIC` ve `PREMIUM` değerlerine sahip olduğunu kontrol edin

