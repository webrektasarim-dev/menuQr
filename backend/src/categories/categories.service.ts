import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PlanService } from '../common/services/plan.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private planService: PlanService,
  ) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    // Check plan limit
    const limitCheck = await this.planService.checkLimit(userId, 'categories');
    if (!limitCheck.allowed) {
      throw new ForbiddenException(
        `Plan limiti: ${limitCheck.limit} kategori. Mevcut: ${limitCheck.current}. Premium plana geçin.`
      );
    }

    // Verify menu belongs to user
    const menu = await this.prisma.menu.findUnique({
      where: { userId },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        menuId: menu.id,
      },
    });
  }

  async findAll(userId: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { userId },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return this.prisma.category.findMany({
      where: { menuId: menu.id },
      include: {
        products: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { userId },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const category = await this.prisma.category.findFirst({
      where: {
        id,
        menuId: menu.id,
      },
      include: {
        products: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(userId: string, id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(userId, id);
    
    return this.prisma.category.update({
      where: { id: category.id },
      data: updateCategoryDto,
    });
  }

  async remove(userId: string, id: string) {
    const category = await this.findOne(userId, id);
    
    return this.prisma.category.delete({
      where: { id: category.id },
    });
  }
}

