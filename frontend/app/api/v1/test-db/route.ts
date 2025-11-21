import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Simple test query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Test connection
    await prisma.$connect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      test: result,
      databaseUrl: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.split('@')[0]}@***` // Hide password
        : 'not set',
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Database connection failed',
      error: error.toString(),
      databaseUrl: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.split('@')[0]}@***`
        : 'not set',
      hint: 'Check DATABASE_URL in Vercel environment variables',
    }, { status: 500 })
  }
}

