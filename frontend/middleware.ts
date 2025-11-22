import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { validateLicense } from '@/lib/license'

export async function middleware(request: NextRequest) {
  // Public routes
  const publicRoutes = [
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/v1/auth/test-token', // Test endpoint for debugging
    '/api/v1/menus/public',
    '/api/v1/tables/public',
    '/api/v1/health',
    '/api/v1/test-db',
    '/api/v1/check-db-url',
    '/api/v1/payments/callback', // PayTR callback
  ]

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes
  // Check all possible header variations (case-insensitive)
  const authHeader = 
    request.headers.get('authorization') || 
    request.headers.get('Authorization') ||
    request.headers.get('AUTHORIZATION') ||
    request.headers.get('x-authorization') ||
    request.headers.get('X-Authorization')
  
  // Debug: Log request info
  console.log('🔍 [Middleware] Request:', {
    path: request.nextUrl.pathname,
    method: request.method,
    hasAuthHeader: !!authHeader,
    authHeaderPrefix: authHeader ? authHeader.substring(0, 30) : 'none'
  })
  
  if (!authHeader) {
    console.error('❌ [Middleware] No authorization header found')
    return NextResponse.json(
      { 
        message: 'Unauthorized: No authorization header', 
        path: request.nextUrl.pathname,
        hint: 'Make sure to send Authorization header with Bearer token'
      },
      { status: 401 }
    )
  }
  
  // Extract token - handle various formats
  let token = authHeader.replace(/^Bearer\s+/i, '').trim()
  token = token.replace(/^bearer\s+/i, '').trim()

  if (!token || token === 'Bearer' || token === 'bearer') {
    console.error('❌ [Middleware] No token in authorization header')
    return NextResponse.json(
      { 
        message: 'Unauthorized: No token provided', 
        authHeaderPrefix: authHeader.substring(0, 30)
      },
      { status: 401 }
    )
  }

  console.log('🔑 [Middleware] Token extracted:', {
    tokenLength: token.length,
    tokenPrefix: token.substring(0, 20) + '...'
  })

  const payload = verifyToken(token)

  if (!payload) {
    console.error('❌ [Middleware] Token verification failed')
    return NextResponse.json(
      { 
        message: 'Unauthorized: Invalid or expired token',
        hint: 'Check JWT_SECRET in Vercel environment variables'
      },
      { status: 401 }
    )
  }

  console.log('✅ [Middleware] Token verified:', {
    userId: payload.sub,
    email: payload.email
  })

  // Lisans kontrolü (sadece admin işlemleri için)
  // Not: BASIC plan için lisans kontrolü yapılmaz (her zaman geçerli)
  // PREMIUM plan için lisans kontrolü validateLicense içinde yapılır
  const adminRoutes = [
    '/api/v1/menus',
    '/api/v1/categories',
    '/api/v1/products',
    '/api/v1/tables',
    '/api/v1/orders',
  ]

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route) &&
    !request.nextUrl.pathname.includes('/public')
  )

  if (isAdminRoute) {
    // validateLicense fonksiyonu içinde BASIC plan kontrolü yapılıyor
    // BASIC plan için her zaman geçerli döner
    const licenseCheck = await validateLicense(payload.sub)
    if (!licenseCheck.valid) {
      return NextResponse.json(
        { message: licenseCheck.message || 'Lisansınız geçersiz veya süresi dolmuş' },
        { status: 403 }
      )
    }
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

