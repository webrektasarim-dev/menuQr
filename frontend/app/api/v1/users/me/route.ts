import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPlanInfo } from '@/lib/plan'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        menu: {
          include: {
            categories: {
              include: {
                products: true,
              },
            },
          },
        },
        tables: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    const planInfo = await getPlanInfo(userId)

    return NextResponse.json({
      ...user,
      password: undefined, // Don't return password
      planInfo,
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get profile' },
      { status: 500 }
    )
  }
}

