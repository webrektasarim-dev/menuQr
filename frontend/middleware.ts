import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { validateLicense } from '@/lib/license'

export async function middleware(request: NextRequest) {
  // Public routes
  const publicRoutes = [
    '/api/v1/auth/register',
    '/api/v1/auth/login',
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
  // Check both 'authorization' and 'Authorization' headers (case-insensitive)
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()

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

