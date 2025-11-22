import { prisma } from './prisma'

interface PlanLimits {
  categories: number
  products: number
  tables: number
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  BASIC: {
    categories: 4,
    products: 40, // 4 kategori × 10 ürün = 40 ürün
    tables: 5,
  },
  PREMIUM: {
    categories: Infinity,
    products: Infinity,
    tables: Infinity,
  },
}

// Plan fiyatları (yıllık)
export const PLAN_PRICES = {
  BASIC: 399,
  PREMIUM: 799,
}

// Plan isimleri
export const PLAN_NAMES = {
  BASIC: 'CafeQR Basic',
  PREMIUM: 'CafeQR Premium',
}

export async function getPlanInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const limits = PLAN_LIMITS[user.plan]

  const [categories, products, tables] = await Promise.all([
    prisma.category.count({
      where: {
        menu: {
          userId,
        },
      },
    }),
    prisma.product.count({
      where: {
        category: {
          menu: {
            userId,
          },
        },
      },
    }),
    prisma.table.count({
      where: { userId },
    }),
  ])

  return {
    plan: user.plan,
    limits: {
      categories: {
        current: categories,
        limit: limits.categories,
        remaining: limits.categories === Infinity ? Infinity : limits.categories - categories,
      },
      products: {
        current: products,
        limit: limits.products,
        remaining: limits.products === Infinity ? Infinity : limits.products - products,
      },
      tables: {
        current: tables,
        limit: limits.tables,
        remaining: limits.tables === Infinity ? Infinity : limits.tables - tables,
      },
    },
  }
}

export async function checkLimit(
  userId: string,
  resource: 'categories' | 'products' | 'tables'
): Promise<{ allowed: boolean; limit: number; current: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const limits = PLAN_LIMITS[user.plan]
  const limit = limits[resource]

  let current = 0

  if (resource === 'categories') {
    current = await prisma.category.count({
      where: {
        menu: {
          userId,
        },
      },
    })
  } else if (resource === 'products') {
    // Basic plan için: her kategoride maksimum 10 ürün kontrolü
    if (user.plan === 'BASIC') {
      const categories = await prisma.category.findMany({
        where: {
          menu: {
            userId,
          },
        },
        include: {
          products: true,
        },
      })
      
      // Her kategoride 10'dan fazla ürün var mı kontrol et
      const hasExceededLimit = categories.some(cat => cat.products.length > 10)
      if (hasExceededLimit) {
        return {
          allowed: false,
          limit: 10,
          current: Math.max(...categories.map(cat => cat.products.length)),
        }
      }
      
      current = await prisma.product.count({
        where: {
          category: {
            menu: {
              userId,
            },
          },
        },
      })
    } else {
      current = await prisma.product.count({
        where: {
          category: {
            menu: {
              userId,
            },
          },
        },
      })
    }
  } else if (resource === 'tables') {
    current = await prisma.table.count({
      where: { userId },
    })
  }

  return {
    allowed: current < limit,
    limit,
    current,
  }
}

// Lisans kontrolü
export async function checkLicense(userId: string): Promise<{ isValid: boolean; expiresAt: Date | null }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { licenseExpiresAt: true },
  })

  if (!user) {
    return { isValid: false, expiresAt: null }
  }

  if (!user.licenseExpiresAt) {
    return { isValid: false, expiresAt: null }
  }

  const now = new Date()
  const expiresAt = new Date(user.licenseExpiresAt)
  const isValid = expiresAt > now

  return { isValid, expiresAt }
}

