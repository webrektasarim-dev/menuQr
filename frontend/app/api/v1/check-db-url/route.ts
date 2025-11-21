import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT SET'
  
  // Parse URL to show structure without password
  let parsedUrl = 'Unable to parse'
  try {
    if (dbUrl && dbUrl !== 'NOT SET') {
      const url = new URL(dbUrl)
      parsedUrl = `${url.protocol}//${url.username}:***@${url.hostname}:${url.port}${url.pathname}${url.search}`
    }
  } catch (e) {
    parsedUrl = dbUrl.substring(0, 50) + '...'
  }
  
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: dbUrl?.length || 0,
    parsedUrl,
    hostname: dbUrl && dbUrl !== 'NOT SET' ? (() => {
      try {
        return new URL(dbUrl).hostname
      } catch {
        return 'Unable to parse'
      }
    })() : 'NOT SET',
    port: dbUrl && dbUrl !== 'NOT SET' ? (() => {
      try {
        return new URL(dbUrl).port
      } catch {
        return 'Unable to parse'
      }
    })() : 'NOT SET',
    hasPgbouncer: dbUrl?.includes('pgbouncer=true') || false,
    hasConnectionLimit: dbUrl?.includes('connection_limit') || false,
    correctFormat: dbUrl?.includes('pooler.supabase.com') && 
                   (dbUrl?.includes(':5432') || dbUrl?.includes(':6543')) &&
                   dbUrl?.includes('pgbouncer=true'),
    recommendation: !dbUrl || dbUrl === 'NOT SET' 
      ? 'DATABASE_URL is not set in Vercel environment variables'
      : !dbUrl.includes('pooler.supabase.com')
      ? 'Use Connection Pooling URL: aws-0-[REGION].pooler.supabase.com'
      : !dbUrl.includes('pgbouncer=true')
      ? 'Add ?pgbouncer=true&connection_limit=1 to connection string'
      : 'Connection string format looks correct',
  })
}

