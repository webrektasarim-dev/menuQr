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

  // If using old format (db.wczfwumhfhuwdrbhyujr.supabase.co), convert to pooling URL
  if (url.includes('db.wczfwumhfhuwdrbhyujr.supabase.co')) {
    console.warn('⚠️ Old database URL format detected. Using connection pooling URL instead.')
    // Convert to connection pooling URL
    const newUrl = url.replace(
      'db.wczfwumhfhuwdrbhyujr.supabase.co:5432',
      'aws-0-eu-central-1.pooler.supabase.com:5432'
    ).replace(
      'postgres://',
      'postgresql://'
    )
    
    // Add pgbouncer params if not present
    if (!newUrl.includes('pgbouncer=true')) {
      const separator = newUrl.includes('?') ? '&' : '?'
      return `${newUrl}${separator}pgbouncer=true&connection_limit=1`
    }
    
    return newUrl
  }

  // If using Supabase connection pooling, ensure pgbouncer params are correct
  if (url.includes('pooler.supabase.com')) {
    const urlObj = new URL(url)
    
    // Ensure pgbouncer=true
    if (!urlObj.searchParams.has('pgbouncer')) {
      urlObj.searchParams.set('pgbouncer', 'true')
    }
    
    // Ensure connection_limit=1 for Prisma
    if (!urlObj.searchParams.has('connection_limit')) {
      urlObj.searchParams.set('connection_limit', '1')
    }
    
    // Ensure postgresql:// protocol
    return urlObj.toString().replace('postgres://', 'postgresql://')
  }

  return url
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

