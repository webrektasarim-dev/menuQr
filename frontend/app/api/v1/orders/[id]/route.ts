import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
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
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: body,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    await prisma.order.delete({
      where: { id: order.id },
    })

    return NextResponse.json({ message: 'Order deleted' })
  } catch (error: any) {
    console.error('Delete order error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete order' },
      { status: 500 }
    )
  }
}

