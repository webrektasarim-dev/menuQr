import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Connection string validation and formatting
function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL
  
  // During build time, DATABASE_URL might not be available
  // Return a placeholder that will be replaced at runtime
  if (!url) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      // In production build, this should be set, but we'll use a placeholder
      // that will fail gracefully at runtime if not set
      throw new Error('DATABASE_URL environment variable is not set. Please set it in Vercel environment variables.')
    }
    // During build/dev, use a placeholder
    return 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
  }

  // Remove psql command if accidentally included
  if (url.startsWith('psql')) {
    console.warn('⚠️ psql command detected in DATABASE_URL. Removing it.')
    // Remove "psql " prefix and quotes
    url = url.replace(/^psql\s+['"]?/, '').replace(/['"]$/, '')
  }

  // Remove leading/trailing quotes if present
  url = url.trim().replace(/^['"]|['"]$/g, '')

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

// Get database URL - always use environment variable at runtime
function getDatabaseUrlForClient(): string {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set. Please set it in Vercel environment variables.')
  }

  // Remove psql command if accidentally included
  let cleanUrl = url
  if (cleanUrl.startsWith('psql')) {
    cleanUrl = cleanUrl.replace(/^psql\s+['"]?/, '').replace(/['"]$/, '')
  }

  // Remove leading/trailing quotes if present
  cleanUrl = cleanUrl.trim().replace(/^['"]|['"]$/g, '')

  // If using Neon, return as-is
  if (cleanUrl.includes('neon.tech')) {
    return cleanUrl
  }

  // For other URLs, use the formatting function
  try {
    const urlObj = new URL(cleanUrl)
    
    // If using direct connection (db.wczfwumhfhuwdrbhyujr.supabase.co), convert to connection pooling
    if (urlObj.hostname.includes('db.wczfwumhfhuwdrbhyujr.supabase.co')) {
      urlObj.hostname = 'aws-0-eu-central-1.pooler.supabase.com'
      urlObj.port = '5432'
      urlObj.search = ''
    }
    
    // If using Supabase connection pooling, ensure clean URL
    if (urlObj.hostname.includes('pooler.supabase.com')) {
      urlObj.searchParams.delete('pgbouncer')
      urlObj.searchParams.delete('connection_limit')
      urlObj.protocol = 'postgresql:'
      return urlObj.toString()
    }
    
    // Ensure postgresql:// protocol
    if (urlObj.protocol === 'postgres:') {
      urlObj.protocol = 'postgresql:'
    }
    
    urlObj.searchParams.delete('pgbouncer')
    urlObj.searchParams.delete('connection_limit')
    
    return urlObj.toString()
  } catch (e) {
    // If URL parsing fails, try basic fixes
    let fixedUrl = cleanUrl.replace('postgres://', 'postgresql://')
    fixedUrl = fixedUrl.replace(/[?&]pgbouncer=true/g, '')
    fixedUrl = fixedUrl.replace(/[?&]connection_limit=\d+/g, '')
    return fixedUrl
  }
}

// Prisma client initialization
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrlForClient(),
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

