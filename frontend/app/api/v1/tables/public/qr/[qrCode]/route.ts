import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { qrCode: string } }
) {
  try {
    const { qrCode } = params

    const table = await prisma.table.findUnique({
      where: { qrCode },
      include: {
        user: {
          select: {
            id: true,
            slug: true,
            businessName: true,
          },
        },
      },
    })

    if (!table) {
      return NextResponse.json(
        { message: 'Table not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(table)
  } catch (error: any) {
    console.error('Get table by QR code error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get table' },
      { status: 500 }
    )
  }
}

