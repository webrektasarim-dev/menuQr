import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            products: {
              where: { isAvailable: true },
              include: {
                options: true,
              },
            },
          },
        },
      },
    })

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(menu)
  } catch (error: any) {
    console.error('Get menu error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get menu' },
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

    // Check if user already has a menu
    const existingMenu = await prisma.menu.findUnique({
      where: { userId },
    })

    if (existingMenu) {
      return NextResponse.json(
        { message: 'User already has a menu' },
        { status: 403 }
      )
    }

    const menu = await prisma.menu.create({
      data: {
        ...body,
        userId,
      },
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error: any) {
    console.error('Create menu error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create menu' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const menu = await prisma.menu.update({
      where: { userId },
      data: body,
    })

    return NextResponse.json(menu)
  } catch (error: any) {
    console.error('Update menu error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update menu' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.menu.delete({
      where: { userId },
    })

    return NextResponse.json({ message: 'Menu deleted' })
  } catch (error: any) {
    console.error('Delete menu error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete menu' },
      { status: 500 }
    )
  }
}

