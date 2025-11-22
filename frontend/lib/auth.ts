import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET: string = process.env.JWT_SECRET || 'cafeqr-super-secret-jwt-key-2024'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

// Warn if using default secret in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('⚠️ [Auth] WARNING: JWT_SECRET is not set! Using default secret. This is insecure!')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { sub: string; email: string; role: string }): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions
  ) as string
}

export function verifyToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    if (!JWT_SECRET) {
      console.error('❌ [Auth] JWT_SECRET is not set')
      return null
    }
    
    if (!token || token.trim() === '') {
      console.error('❌ [Auth] Token is empty')
      return null
    }
    
    console.log('🔍 [Auth] Verifying token:', {
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 20) + '...',
      hasJWTSecret: !!JWT_SECRET,
      jwtSecretLength: JWT_SECRET.length
    })
    
    const decoded = jwt.verify(token, JWT_SECRET)
    
    if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded) {
      console.log('✅ [Auth] Token verified successfully')
      return decoded as { sub: string; email: string; role: string }
    }
    console.error('❌ [Auth] Token decoded but invalid format')
    return null
  } catch (error: any) {
    // Always log error for debugging
    console.error('❌ [Auth] Token verification error:', {
      message: error.message,
      name: error.name,
      tokenLength: token?.length
    })
    return null
  }
}

export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null
  
  const payload = verifyToken(token)
  return payload?.sub || null
}

