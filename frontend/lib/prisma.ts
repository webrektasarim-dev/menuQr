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

  // If using Neon, return as-is (Neon connection strings are already correct)
  if (url.includes('neon.tech') || url.includes('neon.tech')) {
    return url
  }

  try {
    const urlObj = new URL(url)
    
    // If using direct connection (db.wczfwumhfhuwdrbhyujr.supabase.co), convert to connection pooling
    // Direct connection hostname may not be accessible from Vercel
    if (urlObj.hostname.includes('db.wczfwumhfhuwdrbhyujr.supabase.co')) {
      console.warn('⚠️ Direct connection hostname detected. Converting to connection pooling URL for Vercel compatibility.')
      // Convert to connection pooling URL (Transaction mode)
      urlObj.hostname = 'aws-0-eu-central-1.pooler.supabase.com'
      urlObj.port = '5432'
      // Remove any existing params
      urlObj.search = ''
    }
    
    // If using Supabase connection pooling (pooler.supabase.com), ensure clean URL
    if (urlObj.hostname.includes('pooler.supabase.com')) {
      // Remove pgbouncer params - Prisma works better without them in transaction mode
      urlObj.searchParams.delete('pgbouncer')
      urlObj.searchParams.delete('connection_limit')
      
      // Ensure postgresql:// protocol
      urlObj.protocol = 'postgresql:'
      
      return urlObj.toString()
    }
    
    // For other URLs, just ensure postgresql:// protocol
    if (urlObj.protocol === 'postgres:') {
      urlObj.protocol = 'postgresql:'
    }
    
    // Remove any pgbouncer params
    urlObj.searchParams.delete('pgbouncer')
    urlObj.searchParams.delete('connection_limit')
    
    return urlObj.toString()
  } catch (e) {
    console.error('Error parsing DATABASE_URL:', e)
    // If URL parsing fails, try to fix common issues
    let fixedUrl = url.replace('postgres://', 'postgresql://')
    
    // Convert direct connection to pooling if detected
    if (fixedUrl.includes('db.wczfwumhfhuwdrbhyujr.supabase.co')) {
      fixedUrl = fixedUrl.replace(
        'db.wczfwumhfhuwdrbhyujr.supabase.co:5432',
        'aws-0-eu-central-1.pooler.supabase.com:5432'
      )
    }
    
    // Remove pgbouncer params if present
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

