# 🔐 Supabase Configuration

## ✅ Database Migration Tamamlandı!

Tüm tablolar başarıyla oluşturuldu:

- ✅ users
- ✅ menus
- ✅ categories
- ✅ products
- ✅ product_options
- ✅ tables
- ✅ orders
- ✅ order_items
- ✅ campaigns

## 📊 Supabase Bilgileri

- **Project URL:** `https://wczfwumhfhuwdrbhyujr.supabase.co`
- **Project Ref:** `wczfwumhfhuwdrbhyujr`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjemZ3dW1oZmh1d2RyYmh5dWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjY5MjQsImV4cCI6MjA3OTI0MjkyNH0.ynG4H94Wr-GZEYepXGE2HkrbeJIHQpQaLbwfR7H30PM`

## 🔌 Connection String

### Direct Connection (Development)
```
postgresql://postgres.[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Connection Pooling (Production - Önerilen)
Railway/Render için connection pooling kullanın (port 6543):

1. Supabase Dashboard → Project Settings → Database
2. Connection Pooling sekmesine git
3. Connection string'i kopyala
4. Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`

**Önemli:** Password'u Supabase Dashboard'dan almanız gerekiyor!

## 🔒 Güvenlik Ayarları

### Row Level Security (RLS)

Şu anda RLS kapalı. Production'da açmak isterseniz:

```sql
-- Örnek: Users tablosu için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own data"
ON users FOR SELECT
USING (auth.uid() = id::uuid);
```

**Not:** Bu projede backend tarafında JWT ile multi-tenant kontrolü yapıldığı için RLS opsiyoneldir.

## 📝 Railway/Render Environment Variables

Backend deploy için gerekli environment variable:

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

Password'u Supabase Dashboard → Project Settings → Database → Database Password'dan alın!

## ✅ Migration Durumu

Migration başarıyla uygulandı! Artık Railway/Render'da backend deploy edebilirsiniz.

## 🚀 Sonraki Adımlar

1. ✅ Database migration tamamlandı
2. ⏭️ Railway'da backend deploy et
3. ⏭️ Environment variable olarak DATABASE_URL ekle
4. ⏭️ Vercel'da frontend deploy et

