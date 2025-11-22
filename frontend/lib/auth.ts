import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET: string = process.env.JWT_SECRET || 'cafeqr-super-secret-jwt-key-2024'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

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
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    if (!JWT_SECRET) {
      return null
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null
  
  const payload = verifyToken(token)
  return payload?.sub || null
}

