# CafeQR - Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 20+
- PostgreSQL (local veya Supabase/Neon)
- Redis (local veya Upstash - opsiyonel)
- Docker (local development için)

### 1. Projeyi Klonla ve Bağımlılıkları Yükle

```bash
# Root dizinde
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Veritabanı Kurulumu

#### Seçenek A: Local PostgreSQL (Docker)

```bash
# Docker ile PostgreSQL ve Redis başlat
docker-compose up -d postgres redis

# Veritabanı hazır olana kadar bekle (10-15 saniye)
```

#### Seçenek B: Supabase/Neon (Production için önerilen)

1. Supabase veya Neon'da yeni proje oluştur
2. Connection string'i kopyala
3. `backend/.env` dosyasına ekle:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

### 3. Backend Kurulumu

```bash
cd backend

# Prisma Client oluştur
npx prisma generate

# Veritabanı migration'ları çalıştır
npx prisma migrate dev --name init

# (Opsiyonel) Prisma Studio ile veritabanını görüntüle
npx prisma studio
```

### 4. Environment Variables

`backend/.env` dosyasını kontrol et:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cafeqr?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="cafeqr-super-secret-jwt-key-2024-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
API_PREFIX="api/v1"
CORS_ORIGIN="http://localhost:3000"
```

`frontend/.env.local` dosyasını kontrol et:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 5. Backend'i Başlat

```bash
cd backend
npm run start:dev
```

Backend çalışıyor: http://localhost:4000
API Docs: http://localhost:4000/api/docs

### 6. Frontend'i Başlat

Yeni bir terminal aç:

```bash
cd frontend
npm run dev
```

Frontend çalışıyor: http://localhost:3000

## 📝 İlk Kullanıcı Oluşturma

### API ile Kayıt

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "businessName": "Kahve Dünyası",
    "password": "Test123!"
  }'
```

### Veya Swagger UI'dan

1. http://localhost:4000/api/docs adresine git
2. `/auth/register` endpoint'ini aç
3. "Try it out" butonuna tıkla
4. Gerekli bilgileri gir ve "Execute" butonuna tıkla

## 🎯 Test Senaryosu

1. **Kullanıcı Kaydı**: `/auth/register` ile yeni işletme oluştur
2. **Giriş**: `/auth/login` ile giriş yap, token al
3. **Menü Oluştur**: `/menus` POST ile menü oluştur
4. **Kategori Ekle**: `/categories` POST ile kategori ekle
5. **Ürün Ekle**: `/products` POST ile ürün ekle
6. **Masa Oluştur**: `/tables` POST ile masa oluştur
7. **QR Menü Görüntüle**: `http://localhost:3000/menu/[slug]/[table]`

## 🏗️ Proje Yapısı

```
cafeQr/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── menus/       # Menu management
│   │   ├── categories/  # Category management
│   │   ├── products/    # Product management
│   │   ├── tables/      # Table/QR management
│   │   └── orders/      # Order management
│   └── prisma/
│       └── schema.prisma
│
├── frontend/            # Next.js 14
│   ├── app/
│   │   ├── menu/        # Public QR menu pages
│   │   └── admin/       # Business admin panel
│   └── lib/
│       └── api.ts       # API client
│
└── docker-compose.yml   # Local development
```

## 🔒 Multi-Tenant Güvenlik

Her işletme kendi verilerine erişir:
- Tüm API endpoint'leri `userId` ile filtreler
- JWT token'da `userId` bulunur
- Tenant Guard ile ekstra güvenlik

## 📦 Paket Sistemi

- **FREE**: 1 menu, 5 categories, 50 products, 3 tables
- **PREMIUM**: Unlimited + advanced features

Paket kontrolü ileride eklenecek.

## 🚀 Production Deployment

### Backend (Railway/Render)

1. Railway veya Render'da yeni proje oluştur
2. GitHub repo'yu bağla
3. Environment variables ekle
4. Deploy et

### Frontend (Vercel)

1. Vercel'de yeni proje oluştur
2. GitHub repo'yu bağla
3. `NEXT_PUBLIC_API_URL` environment variable ekle
4. Deploy et

### Database (Supabase/Neon)

1. Production database oluştur
2. Connection string'i backend'e ekle
3. Migration'ları çalıştır

## 🐛 Sorun Giderme

### Backend çalışmıyor
- PostgreSQL çalışıyor mu? (`docker ps`)
- `.env` dosyası doğru mu?
- Port 4000 kullanımda mı?

### Frontend çalışmıyor
- Backend çalışıyor mu?
- `NEXT_PUBLIC_API_URL` doğru mu?
- Port 3000 kullanımda mı?

### Database bağlantı hatası
- PostgreSQL çalışıyor mu?
- `DATABASE_URL` doğru mu?
- Migration'lar çalıştırıldı mı?

## 📚 API Dokümantasyonu

Swagger UI: http://localhost:4000/api/docs

## 🎉 Başarılı!

Artık 1000+ işletmeyi destekleyecek multi-tenant QR menü sisteminiz hazır!

