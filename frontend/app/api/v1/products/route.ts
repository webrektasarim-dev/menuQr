import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkLimit } from '@/lib/plan'

export const dynamic = 'force-dynamic'

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
    const categoryId = searchParams.get('categoryId')

    const where: any = {
      category: {
        menu: {
          userId,
        },
      },
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        options: true,
        category: true,
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get products' },
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

    // Check plan limit
    const limitCheck = await checkLimit(userId, 'products')
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { message: `Plan limiti: ${limitCheck.limit} ürün. Mevcut: ${limitCheck.current}. Premium plana geçin.` },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Verify category belongs to user's menu
    const category = await prisma.category.findFirst({
      where: {
        id: body.categoryId,
        menu: {
          userId,
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.create({
      data: body,
      include: {
        options: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

