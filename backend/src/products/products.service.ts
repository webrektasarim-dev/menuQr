import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PlanService } from '../common/services/plan.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private planService: PlanService,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto) {
    // Check plan limit
    const limitCheck = await this.planService.checkLimit(userId, 'products');
    if (!limitCheck.allowed) {
      throw new ForbiddenException(
        `Plan limiti: ${limitCheck.limit} ürün. Mevcut: ${limitCheck.current}. Premium plana geçin.`
      );
    }

    // Verify category belongs to user's menu
    const category = await this.prisma.category.findFirst({
      where: {
        id: createProductDto.categoryId,
        menu: {
          userId,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        options: true,
      },
    });
  }

  async findAll(userId: string, categoryId?: string) {
    const where: any = {
      category: {
        menu: {
          userId,
        },
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        options: true,
        category: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        category: {
          menu: {
            userId,
          },
        },
      },
      include: {
        options: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(userId: string, id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        options: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.product.delete({
      where: { id },
    });
  }
}

