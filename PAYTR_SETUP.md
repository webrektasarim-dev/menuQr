# PayTR Ödeme Entegrasyonu Kurulum Rehberi

## Vercel Environment Variables

Aşağıdaki environment variable'ları Vercel'e ekleyin:

```
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
NEXT_PUBLIC_APP_URL=https://menu-qr-frontend.vercel.app
```

## PayTR Hesap Bilgileri

1. PayTR hesabınızdan Merchant ID, Merchant Key ve Merchant Salt bilgilerini alın
2. Bu bilgileri Vercel environment variables'a ekleyin
3. PayTR callback URL'ini ayarlayın: `https://menu-qr-frontend.vercel.app/api/v1/payments/callback`

## Migration

Database migration'ı deploy etmek için:

1. Vercel'de otomatik olarak `prisma migrate deploy` çalışacak (postinstall script)
2. Veya manuel olarak Neon database'de migration'ı çalıştırın

## Test Modu

Development ortamında test modu aktif olacak. Production'da `NODE_ENV=production` olduğunda gerçek ödeme alınacak.

