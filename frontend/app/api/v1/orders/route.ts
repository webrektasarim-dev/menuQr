import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as OrderStatus | null

    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
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
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Verify table belongs to user
    const table = await prisma.table.findFirst({
      where: {
        id: body.tableId,
        userId,
      },
    })

    if (!table) {
      return NextResponse.json(
        { message: 'Table not found' },
        { status: 404 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    const orderItems = []

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { message: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      const itemPrice = product.price * item.quantity
      totalAmount += itemPrice

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        notes: item.notes,
        options: item.options || {},
      })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        tableId: body.tableId,
        userId,
        status: OrderStatus.PENDING,
        paymentMethod: body.paymentMethod,
        totalAmount,
        notes: body.notes,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
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
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

