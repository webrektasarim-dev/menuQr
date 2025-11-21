import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const user = await prisma.user.findUnique({
      where: { slug },
      include: {
        menu: {
          include: {
            categories: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              include: {
                products: {
                  where: { isAvailable: true },
                  include: {
                    options: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user || !user.menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user.menu)
  } catch (error: any) {
    console.error('Get public menu error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get menu' },
      { status: 500 }
    )
  }
}

