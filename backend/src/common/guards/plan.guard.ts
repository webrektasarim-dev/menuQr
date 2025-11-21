import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlanType } from '@prisma/client';

interface PlanLimits {
  FREE: {
    categories: number;
    products: number;
    tables: number;
  };
  PREMIUM: {
    categories: number;
    products: number;
    tables: number;
  };
}

const PLAN_LIMITS: PlanLimits = {
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
};

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Get user with plan info
    const userData = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { plan: true },
    });

    if (!userData) {
      throw new ForbiddenException('User not found');
    }

    const plan = userData.plan;
    const limits = PLAN_LIMITS[plan];

    // Check limits based on route
    const route = request.route.path;
    const method = request.method;

    if (route.includes('/categories') && method === 'POST') {
      const categoryCount = await this.prisma.category.count({
        where: {
          menu: {
            userId: user.userId,
          },
        },
      });

      if (categoryCount >= limits.categories) {
        throw new ForbiddenException(
          `Plan limiti: ${limits.categories} kategori. Premium plana geçin.`
        );
      }
    }

    if (route.includes('/products') && method === 'POST') {
      const productCount = await this.prisma.product.count({
        where: {
          category: {
            menu: {
              userId: user.userId,
            },
          },
        },
      });

      if (productCount >= limits.products) {
        throw new ForbiddenException(
          `Plan limiti: ${limits.products} ürün. Premium plana geçin.`
        );
      }
    }

    if (route.includes('/tables') && method === 'POST') {
      const tableCount = await this.prisma.table.count({
        where: { userId: user.userId },
      });

      if (tableCount >= limits.tables) {
        throw new ForbiddenException(
          `Plan limiti: ${limits.tables} masa. Premium plana geçin.`
        );
      }
    }

    return true;
  }
}

