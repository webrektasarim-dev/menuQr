import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      merchant_oid,
      status,
      total_amount,
      hash,
    } = body

    // Hash doğrulama
    const hashStr = `${PAYTR_MERCHANT_SALT}${merchant_oid}${PAYTR_MERCHANT_KEY}${total_amount}${status}`
    const calculatedHash = crypto
      .createHmac('sha256', PAYTR_MERCHANT_SALT)
      .update(hashStr)
      .digest('base64')

    if (hash !== calculatedHash) {
      return NextResponse.json(
        { message: 'Invalid hash' },
        { status: 400 }
      )
    }

    // Payment'ı bul
    const payment = await prisma.payment.findUnique({
      where: { paytrOrderId: merchant_oid },
      include: { user: true },
    })

    if (!payment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      )
    }

    if (status === 'success') {
      // Ödeme başarılı - lisansı güncelle
      const now = new Date()
      const expiresAt = new Date(now)
      expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 yıl ekle

      await prisma.$transaction([
        // Payment'ı güncelle
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            paymentDate: now,
            licenseExpiresAt: expiresAt,
          },
        }),
        // User'ı güncelle
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            plan: payment.plan,
            licenseExpiresAt: expiresAt,
            lastPaymentAt: now,
          },
        }),
      ])

      return NextResponse.json({ status: 'success' })
    } else {
      // Ödeme başarısız
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
        },
      })

      return NextResponse.json({ status: 'failed' })
    }
  } catch (error: any) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { message: error.message || 'Payment callback failed' },
      { status: 500 }
    )
  }
}

