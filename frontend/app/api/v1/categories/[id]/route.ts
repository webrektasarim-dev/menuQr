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

    const menu = await prisma.menu.findUnique({
      where: { userId },
    })

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        menuId: menu.id,
      },
      include: {
        products: {
          include: {
            options: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get category' },
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

    const menu = await prisma.menu.findUnique({
      where: { userId },
    })

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        menuId: menu.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const updated = await prisma.category.update({
      where: { id: category.id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update category' },
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

    const menu = await prisma.menu.findUnique({
      where: { userId },
    })

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        menuId: menu.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    await prisma.category.delete({
      where: { id: category.id },
    })

    return NextResponse.json({ message: 'Category deleted' })
  } catch (error: any) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}

