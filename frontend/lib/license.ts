import { prisma } from './prisma'
import { checkLicense } from './plan'

// Lisans kontrolü - kullanıcının lisansı geçerli mi?
export async function validateLicense(userId: string): Promise<{ valid: boolean; message?: string }> {
  try {
    const { isValid, expiresAt } = await checkLicense(userId)

    if (!isValid) {
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
    }

    return { valid: true }
  } catch (error) {
    console.error('License validation error:', error)
    return {
      valid: false,
      message: 'Lisans kontrolü sırasında bir hata oluştu.',
    }
  }
}

