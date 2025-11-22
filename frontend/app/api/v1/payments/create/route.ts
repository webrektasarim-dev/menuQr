import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PLAN_PRICES } from '@/lib/plan'
import { PlanType } from '@prisma/client'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// PayTR API bilgileri (Vercel environment variables'dan alınacak)
const PAYTR_MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || ''
const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || (plan !== 'BASIC' && plan !== 'PREMIUM')) {
      return NextResponse.json(
        { message: 'Invalid plan' },
        { status: 400 }
      )
    }

    const amount = PLAN_PRICES[plan]
    const orderId = `ORDER-${Date.now()}-${userId.substring(0, 8)}`

    // Payment kaydı oluştur
    const payment = await prisma.payment.create({
      data: {
        userId,
        plan: plan as PlanType,
        amount,
        currency: 'TRY',
        paytrOrderId: orderId,
        status: 'PENDING',
      },
    })

    // PayTR ödeme formu için token oluştur
    const email = (await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    }))?.email || ''

    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'

    // PayTR hash oluştur
    const hashStr = `${PAYTR_MERCHANT_ID}${email}${amount}${orderId}${userAgent}${ipAddress}`
    const hash = crypto
      .createHmac('sha256', PAYTR_MERCHANT_SALT)
      .update(hashStr)
      .digest('base64')

    // PayTR API'ye istek gönder
    const paytrData = {
      merchant_id: PAYTR_MERCHANT_ID,
      merchant_key: PAYTR_MERCHANT_KEY,
      merchant_salt: PAYTR_MERCHANT_SALT,
      email,
      payment_amount: amount * 100, // Kuruş cinsinden
      merchant_oid: orderId,
      user_name: email.split('@')[0],
      user_address: '',
      user_phone: '',
      merchant_ok_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://menu-qr-frontend.vercel.app'}/admin/settings?payment=success`,
      merchant_fail_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://menu-qr-frontend.vercel.app'}/admin/settings?payment=failed`,
      user_basket: `${plan} Plan - Yıllık Lisans`,
      user_ip: ipAddress,
      timeout_limit: 30,
      test_mode: process.env.NODE_ENV === 'development' ? '1' : '0',
      no_installment: 0,
      max_installment: 0,
      currency: 'TL',
      lang: 'tr',
    }

    // PayTR token al
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(paytrData as any).toString(),
    })

    const paytrResult = await paytrResponse.json()

    if (paytrResult.status === 'success') {
      // Payment'a token kaydet
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paytrToken: paytrResult.token,
        },
      })

      return NextResponse.json({
        token: paytrResult.token,
        orderId: payment.id,
        paymentUrl: `https://www.paytr.com/odeme/guvenli/${paytrResult.token}`,
      })
    } else {
      return NextResponse.json(
        { message: paytrResult.reason || 'Payment initialization failed' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}

