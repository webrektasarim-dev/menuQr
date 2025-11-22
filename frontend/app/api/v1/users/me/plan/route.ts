import { NextRequest, NextResponse } from 'next/server'
import { getPlanInfo } from '@/lib/plan'

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

    const planInfo = await getPlanInfo(userId)

    return NextResponse.json(planInfo)
  } catch (error: any) {
    console.error('Get plan info error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to get plan info' },
      { status: 500 }
    )
  }
}

