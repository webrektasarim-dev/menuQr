import { prisma } from './prisma'

interface PlanLimits {
  categories: number
  products: number
  tables: number
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  FREE: {
    categories: 5,
    products: 50,
    tables: 3,
  },
  PREMIUM: {
    categories: Infinity,
    products: Infinity,
    tables: Infinity,
  },
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
    current = await prisma.product.count({
      where: {
        category: {
          menu: {
            userId,
          },
        },
      },
    })
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

