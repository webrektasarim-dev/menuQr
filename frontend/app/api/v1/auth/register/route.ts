import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, businessName, password } = body

    // Validation
    if (!email || !businessName || !password) {
      return NextResponse.json(
        { message: 'Email, business name and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate slug
    let slug = generateSlug(businessName)
    let slugExists = await prisma.user.findUnique({ where: { slug } })
    
    // If slug exists, add number
    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(businessName)}-${counter}`
      slugExists = await prisma.user.findUnique({ where: { slug } })
      counter++
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        businessName,
        slug,
        plan: 'FREE',
        role: 'ADMIN',
      },
    })

    // Generate token
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        slug: user.slug,
        plan: user.plan,
      },
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}

