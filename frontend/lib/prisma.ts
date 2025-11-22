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
    
    // If using Supabase connection pooling (pooler.supabase.com), remove pgbouncer params
    if (urlObj.hostname.includes('pooler.supabase.com')) {
      // Remove pgbouncer params - Prisma doesn't work well with transaction mode + pgbouncer
      urlObj.searchParams.delete('pgbouncer')
      urlObj.searchParams.delete('connection_limit')
      
      // Ensure postgresql:// protocol
      urlObj.protocol = 'postgresql:'
      
      return urlObj.toString()
    }
    
    // For direct connection (db.wczfwumhfhuwdrbhyujr.supabase.co), use as-is
    // Just ensure postgresql:// protocol
    if (urlObj.protocol === 'postgres:') {
      urlObj.protocol = 'postgresql:'
    }
    
    // Remove any pgbouncer params if accidentally present in direct connection
    urlObj.searchParams.delete('pgbouncer')
    urlObj.searchParams.delete('connection_limit')
    
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

