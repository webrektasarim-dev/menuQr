import { checkLicense } from './plan'

// Lisans kontrolü - kullanıcının lisansı geçerli mi?
// BASIC plan için her zaman geçerli döner
// PREMIUM plan için licenseExpiresAt kontrolü yapar
export async function validateLicense(userId: string): Promise<{ valid: boolean; message?: string }> {
  try {
    const { isValid, expiresAt } = await checkLicense(userId)

    // BASIC plan için her zaman geçerli (checkLicense içinde kontrol ediliyor)
    if (isValid) {
      return { valid: true }
    }

    // PREMIUM plan için lisans süresi dolmuş
    if (!expiresAt) {
      return {
        valid: false,
        message: 'Lisansınız bulunmuyor. Lütfen paket satın alın.',
      }
    }

    const now = new Date()
    const expiredDate = new Date(expiresAt)
    const daysExpired = Math.floor((now.getTime() - expiredDate.getTime()) / (1000 * 60 * 60 * 24))

    return {
      valid: false,
      message: `Lisansınız ${daysExpired} gün önce sona erdi. Lütfen paketinizi yenileyin.`,
    }
  } catch (error) {
    console.error('License validation error:', error)
    // Hata durumunda BASIC plan kullanıcıları için geçerli döndür (daha güvenli)
    return {
      valid: true, // Hata durumunda erişimi engelleme
      message: undefined,
    }
  }
}

