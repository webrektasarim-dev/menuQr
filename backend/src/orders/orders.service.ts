import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // Verify table belongs to user
    const table = await this.prisma.table.findFirst({
      where: {
        id: createOrderDto.tableId,
        userId,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of createOrderDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const itemPrice = product.price * item.quantity;
      totalAmount += itemPrice;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        notes: item.notes,
        options: item.options || {},
      });
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        tableId: createOrderDto.tableId,
        userId,
        status: OrderStatus.PENDING,
        paymentMethod: createOrderDto.paymentMethod,
        totalAmount,
        notes: createOrderDto.notes,
        customerName: createOrderDto.customerName,
        customerPhone: createOrderDto.customerPhone,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    return order;
  }

  async findAll(userId: string, status?: OrderStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(userId: string, id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.order.delete({
      where: { id },
    });
  }
}

