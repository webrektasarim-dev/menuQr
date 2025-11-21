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

    const tables = await prisma.table.findMany({
      where: { userId },
      orderBy: { number: 'asc' },
    })

    return NextResponse.json(tables)
  } catch (error: any) {
    console.error('Get tables error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get tables' },
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
    const limitCheck = await checkLimit(userId, 'tables')
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { message: `Plan limiti: ${limitCheck.limit} masa. Mevcut: ${limitCheck.current}. Premium plana geçin.` },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Generate QR code
    const qrCode = `table-${body.number}`

    const table = await prisma.table.create({
      data: {
        ...body,
        userId,
        qrCode,
      },
    })

    return NextResponse.json(table, { status: 201 })
  } catch (error: any) {
    console.error('Create table error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create table' },
      { status: 500 }
    )
  }
}

