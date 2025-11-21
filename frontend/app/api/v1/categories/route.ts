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

    const menu = await prisma.menu.findUnique({
      where: { userId },
    })

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    const categories = await prisma.category.findMany({
      where: { menuId: menu.id },
      include: {
        products: true,
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get categories' },
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
    const limitCheck = await checkLimit(userId, 'categories')
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { message: `Plan limiti: ${limitCheck.limit} kategori. Mevcut: ${limitCheck.current}. Premium plana geçin.` },
        { status: 403 }
      )
    }

    const menu = await prisma.menu.findUnique({
      where: { userId },
    })

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const category = await prisma.category.create({
      data: {
        ...body,
        menuId: menu.id,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}

