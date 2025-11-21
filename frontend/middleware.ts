import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Public routes
  const publicRoutes = [
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/v1/menus/public',
    '/api/v1/tables/public',
    '/api/v1/health',
  ]

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }

  // Add user info to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.sub)
  requestHeaders.set('x-user-email', payload.email)
  requestHeaders.set('x-user-role', payload.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/api/v1/:path*',
}

