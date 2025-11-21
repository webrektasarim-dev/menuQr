import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Connection string validation and formatting
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // If using Supabase connection pooling, ensure pgbouncer params are correct
  // Remove connection_limit if present (Prisma manages this internally)
  if (url.includes('pooler.supabase.com') && url.includes('pgbouncer=true')) {
    // Ensure connection_limit is set to 1 for Prisma compatibility
    const urlObj = new URL(url)
    urlObj.searchParams.set('connection_limit', '1')
    urlObj.searchParams.set('pgbouncer', 'true')
    return urlObj.toString().replace('postgresql://', 'postgresql://').replace('postgres://', 'postgresql://')
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
  // Connection pool settings for Vercel serverless
  ...(process.env.DATABASE_URL?.includes('pooler.supabase.com') && {
    // For Supabase connection pooling
  }),
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

