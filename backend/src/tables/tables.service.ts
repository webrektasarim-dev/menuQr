import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PlanService } from '../common/services/plan.service';

@Injectable()
export class TablesService {
  constructor(
    private prisma: PrismaService,
    private planService: PlanService,
  ) {}

  async create(userId: string, createTableDto: CreateTableDto) {
    // Check plan limit
    const limitCheck = await this.planService.checkLimit(userId, 'tables');
    if (!limitCheck.allowed) {
      throw new ForbiddenException(
        `Plan limiti: ${limitCheck.limit} masa. Mevcut: ${limitCheck.current}. Premium plana geçin.`
      );
    }

    // Generate QR code slug
    const qrCode = `table-${createTableDto.number}`;

    return this.prisma.table.create({
      data: {
        ...createTableDto,
        userId,
        qrCode,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.table.findMany({
      where: { userId },
      orderBy: { number: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const table = await this.prisma.table.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async update(userId: string, id: string, updateTableDto: UpdateTableDto) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.table.delete({
      where: { id },
    });
  }

  async findByQrCode(qrCode: string) {
    const table = await this.prisma.table.findUnique({
      where: { qrCode },
      include: {
        user: {
          select: {
            id: true,
            slug: true,
            businessName: true,
          },
        },
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }
}

