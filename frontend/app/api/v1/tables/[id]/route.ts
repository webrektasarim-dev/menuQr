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

    const table = await prisma.table.findFirst({
      where: {
        id: params.id,
        userId,
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
    console.error('Get table error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get table' },
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

    const table = await prisma.table.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!table) {
      return NextResponse.json(
        { message: 'Table not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const updated = await prisma.table.update({
      where: { id: table.id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Update table error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update table' },
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

    const table = await prisma.table.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!table) {
      return NextResponse.json(
        { message: 'Table not found' },
        { status: 404 }
      )
    }

    await prisma.table.delete({
      where: { id: table.id },
    })

    return NextResponse.json({ message: 'Table deleted' })
  } catch (error: any) {
    console.error('Delete table error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete table' },
      { status: 500 }
    )
  }
}

