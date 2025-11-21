# 📦 GitHub Repository Oluşturma ve Push

## 🚀 Adım Adım GitHub'a Push

### 1️⃣ GitHub'da Repository Oluşturun

1. GitHub.com'a gidin ve giriş yapın
2. **New Repository** butonuna tıklayın (sağ üst + işareti)
3. Repository ayarları:
   - **Repository name:** `cafeqr` (veya istediğiniz isim)
   - **Description:** `Multi-tenant QR Menu System for Restaurants & Cafes`
   - **Visibility:** Private (veya Public - tercihinize göre)
   - ✅ **Do NOT** initialize with README, .gitignore, or license (zaten var)
4. **Create repository** butonuna tıklayın

### 2️⃣ Repository URL'ini Kopyalayın

GitHub'da oluşturduğunuz repository sayfasında, **HTTPS** URL'ini kopyalayın:
```
https://github.com/[KULLANICI_ADINIZ]/cafeqr.git
```

### 3️⃣ Local Repository'yi GitHub'a Bağlayın

Terminal'de şu komutları çalıştırın:

```bash
# Remote repository ekle (URL'i kendi repository URL'inizle değiştirin)
git remote add origin https://github.com/[KULLANICI_ADINIZ]/cafeqr.git

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub'a push et
git push -u origin main
```

**Not:** GitHub username ve password/token isteyebilir. Eğer 2FA aktifse, **Personal Access Token** kullanmanız gerekecek.

### 4️⃣ Personal Access Token Oluşturma (Gerekirse)

Eğer push sırasında authentication hatası alırsanız:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token (classic)**
3. **Note:** `CafeQR Deployment`
4. **Scopes:** `repo` (tüm repository erişimi)
5. **Generate token**
6. Token'ı kopyalayın (sadece bir kez gösterilir!)
7. Push yaparken **password** yerine bu **token**'ı kullanın

### 5️⃣ Alternatif: SSH ile Push (Önerilen)

SSH kullanmak isterseniz:

```bash
# SSH key kontrol edin
ls -al ~/.ssh

# SSH key yoksa oluşturun
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH key'i GitHub'a ekleyin (Terminal'de gösterilen public key'i kopyalayın)
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys → New SSH key
# Key'i yapıştırın ve kaydedin

# Remote'u SSH URL'iyle değiştirin
git remote set-url origin git@github.com:[KULLANICI_ADINIZ]/cafeqr.git

# Push edin
git push -u origin main
```

## ✅ Push Sonrası

Push tamamlandıktan sonra:

1. GitHub repository sayfasını yenileyin
2. Tüm dosyaların orada olduğunu kontrol edin
3. Artık Railway ve Vercel'da repository'yi görebileceksiniz!

## 🚀 Sonraki Adımlar

1. ✅ GitHub repository oluşturuldu
2. ⏭️ Railway → New Project → Deploy from GitHub repo
3. ⏭️ Repository'yi seçin ve deploy edin
4. ⏭️ Vercel → Add New Project → Import Git Repository
5. ⏭️ Repository'yi seçin ve deploy edin

## 🐛 Sorun Giderme

### "remote origin already exists" hatası

```bash
git remote remove origin
git remote add origin https://github.com/[KULLANICI_ADINIZ]/cafeqr.git
```

### "Authentication failed" hatası

Personal Access Token kullanın (yukarıdaki adım 4'e bakın)

### "Permission denied" hatası

Repository'nin sahibi olduğunuzdan emin olun veya collaborator olarak eklendiğinizden emin olun

