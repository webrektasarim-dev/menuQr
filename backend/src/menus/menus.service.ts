import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CacheService } from '../common/services/cache.service';

@Injectable()
export class MenusService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(userId: string, createMenuDto: CreateMenuDto) {
    // Check if user already has a menu
    const existingMenu = await this.prisma.menu.findUnique({
      where: { userId },
    });

    if (existingMenu) {
      throw new ForbiddenException('User already has a menu');
    }

    return this.prisma.menu.create({
      data: {
        ...createMenuDto,
        userId,
      },
    });
  }

  async findOne(userId: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { userId },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            products: {
              where: { isAvailable: true },
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async findBySlug(slug: string) {
    // Try cache first
    const cacheKey = `menu:slug:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { slug },
      include: {
        menu: {
          include: {
            categories: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              include: {
                products: {
                  where: { isAvailable: true },
                  include: {
                    options: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.menu) {
      throw new NotFoundException('Menu not found');
    }

    // Cache for 1 hour
    await this.cache.set(cacheKey, user.menu, 3600);

    return user.menu;
  }

  async update(userId: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.prisma.menu.update({
      where: { userId },
      data: updateMenuDto,
    });

    // Invalidate cache
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { slug: true },
    });
    if (user?.slug) {
      await this.cache.del(`menu:slug:${user.slug}`);
    }

    return menu;
  }

  async remove(userId: string) {
    return this.prisma.menu.delete({
      where: { userId },
    });
  }
}

