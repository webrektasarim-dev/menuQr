import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Connection string validation and formatting
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set. Please set it in Vercel environment variables.')
  }

  try {
    const urlObj = new URL(url)
    
    // If using old format (db.wczfwumhfhuwdrbhyujr.supabase.co), convert to pooling URL
    if (url.includes('db.wczfwumhfhuwdrbhyujr.supabase.co')) {
      console.warn('⚠️ Old database URL format detected. Converting to connection pooling URL.')
      urlObj.hostname = 'aws-0-eu-central-1.pooler.supabase.com'
      urlObj.port = '5432'
    }
    
    // If using Supabase connection pooling, configure for Prisma
    if (urlObj.hostname.includes('pooler.supabase.com')) {
      // For Prisma with Supabase, use Transaction mode (port 5432) WITHOUT pgbouncer params
      // OR use Direct connection without pooling
      // Remove pgbouncer params - Prisma doesn't work well with transaction mode + pgbouncer
      urlObj.searchParams.delete('pgbouncer')
      urlObj.searchParams.delete('connection_limit')
      
      // Ensure postgresql:// protocol
      urlObj.protocol = 'postgresql:'
      
      // Return connection pooling URL without pgbouncer (acts as direct connection through pooler)
      return urlObj.toString()
    }
    
    // Ensure postgresql:// protocol for all URLs
    if (urlObj.protocol === 'postgres:') {
      urlObj.protocol = 'postgresql:'
    }
    
    return urlObj.toString()
  } catch (e) {
    console.error('Error parsing DATABASE_URL:', e)
    // If URL parsing fails, try to fix common issues
    let fixedUrl = url.replace('postgres://', 'postgresql://')
    
    // Remove pgbouncer params if present (causing issues)
    fixedUrl = fixedUrl.replace(/[?&]pgbouncer=true/g, '')
    fixedUrl = fixedUrl.replace(/[?&]connection_limit=\d+/g, '')
    
    return fixedUrl
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

