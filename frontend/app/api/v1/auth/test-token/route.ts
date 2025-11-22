import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { 
          error: 'No authorization header',
          headers: Object.fromEntries(request.headers.entries())
        },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token in header', authHeader },
        { status: 401 }
      )
    }
    
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token', tokenLength: token.length, tokenPrefix: token.substring(0, 20) },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      payload,
      tokenLength: token.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

