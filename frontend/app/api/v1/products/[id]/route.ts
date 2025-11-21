import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
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
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get product' },
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

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        category: {
          menu: {
            userId,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: body,
      include: {
        options: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update product' },
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

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        category: {
          menu: {
            userId,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id: product.id },
    })

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}

