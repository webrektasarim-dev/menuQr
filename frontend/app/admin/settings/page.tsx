'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Crown, Check, Calendar, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { PLAN_NAMES, PLAN_PRICES } from '@/lib/plan'

export default function SettingsPage() {
  const router = useRouter()
  const [processingPayment, setProcessingPayment] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)

  useEffect(() => {
    // Mark as mounted to prevent SSR issues
    setIsMounted(true)
    
    // Only check on client side
    if (typeof window === 'undefined') return
    
    // Try localStorage first, then sessionStorage
    let token = localStorage.getItem('token')
    if (!token) {
      token = sessionStorage.getItem('token')
      if (token) {
        localStorage.setItem('token', token)
      }
    }
    
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // Get payment status from URL safely
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const status = urlParams.get('payment')
      if (status) {
        setPaymentStatus(status)
      }
    } catch (error) {
      console.error('Error reading payment status:', error)
    }
  }, [router])

  // Separate effect for payment callback to avoid dependency issues
  useEffect(() => {
    if (!isMounted || !paymentStatus || typeof window === 'undefined') return
    
    try {
      if (paymentStatus === 'success') {
        toast.success('Ödeme başarılı! Lisansınız aktif edildi.')
        // Plan bilgilerini yenile
        setTimeout(() => {
          window.location.href = '/admin/settings'
        }, 1000)
      } else if (paymentStatus === 'failed') {
        toast.error('Ödeme başarısız oldu. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }, [isMounted, paymentStatus]) // Only depend on isMounted and paymentStatus

  // Prevent SSR rendering issues
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
          <div>Yükleniyor...</div>
        </div>
      </div>
    )
  }

  const { data: planInfo, isLoading, error: planError, refetch } = useQuery({
    queryKey: ['plan-info'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/users/me/plan')
        return data
      } catch (error: any) {
        if (error.response?.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
  })

  const { data: userInfo } = useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/users/me')
        return data
      } catch (error: any) {
        return null
      }
    },
    retry: false,
  })

  const { mutate: createPayment } = useMutation({
    mutationFn: async (plan: 'BASIC' | 'PREMIUM') => {
      const { data } = await api.post('/payments/create', { plan })
      return data
    },
    onSuccess: (data) => {
      // PayTR ödeme sayfasına yönlendir
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ödeme başlatılamadı')
      setProcessingPayment(false)
    },
  })

  const handlePayment = (plan: 'BASIC' | 'PREMIUM') => {
    setProcessingPayment(true)
    createPayment(plan)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
          <div>Yükleniyor...</div>
        </div>
      </div>
    )
  }

  const isPremium = planInfo?.plan === 'PREMIUM'
  const isBasic = planInfo?.plan === 'BASIC'
  const limits = planInfo?.limits || {
    categories: { current: 0, limit: 4 },
    products: { current: 0, limit: 40 },
    tables: { current: 0, limit: 5 },
  }

  const licenseExpiresAt = userInfo?.licenseExpiresAt
    ? new Date(userInfo.licenseExpiresAt)
    : null
  // BASIC plan için her zaman geçerli, PREMIUM için licenseExpiresAt kontrolü
  const isLicenseValid = isBasic ? true : (licenseExpiresAt ? licenseExpiresAt > new Date() : false)

  return (
    <div className="min-h-screen bg-primary-light">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-primary-accent"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-primary">Ayarlar & Paket</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* License Status */}
        {licenseExpiresAt && (
          <div className={`rounded-lg shadow-md p-6 mb-6 ${
            isLicenseValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className={`w-6 h-6 ${isLicenseValid ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className={`text-lg font-semibold ${isLicenseValid ? 'text-green-800' : 'text-red-800'}`}>
                {isLicenseValid ? 'Lisansınız Aktif' : 'Lisansınız Süresi Dolmuş'}
              </h3>
            </div>
            <p className={`text-sm ${isLicenseValid ? 'text-green-700' : 'text-red-700'}`}>
              {isLicenseValid 
                ? `Lisans bitiş tarihi: ${licenseExpiresAt.toLocaleDateString('tr-TR')}`
                : `Lisans bitiş tarihi: ${licenseExpiresAt.toLocaleDateString('tr-TR')} - Lütfen paketinizi yenileyin.`
              }
            </p>
          </div>
        )}

        {/* Plan Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Mevcut Paket</h2>
            <span className="px-4 py-2 bg-primary-accent text-white rounded-lg font-semibold">
              {planInfo?.plan ? PLAN_NAMES[planInfo.plan] : PLAN_NAMES.BASIC}
            </span>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Kategoriler</span>
                <span className="text-sm text-gray-600">
                  {limits.categories?.current || 0} /{' '}
                  {limits.categories?.limit === Infinity
                    ? '∞'
                    : limits.categories?.limit || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-accent h-2 rounded-full"
                  style={{
                    width: `${
                      limits.categories?.limit === Infinity
                        ? 100
                        : Math.min(
                            ((limits.categories?.current || 0) /
                              (limits.categories?.limit || 1)) *
                              100,
                            100
                          )
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Ürünler (Kategori başına max 10)</span>
                <span className="text-sm text-gray-600">
                  {limits.products?.current || 0} /{' '}
                  {limits.products?.limit === Infinity
                    ? '∞'
                    : limits.products?.limit || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-accent h-2 rounded-full"
                  style={{
                    width: `${
                      limits.products?.limit === Infinity
                        ? 100
                        : Math.min(
                            ((limits.products?.current || 0) /
                              (limits.products?.limit || 1)) *
                              100,
                            100
                          )
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Masalar</span>
                <span className="text-sm text-gray-600">
                  {limits.tables?.current || 0} /{' '}
                  {limits.tables?.limit === Infinity
                    ? '∞'
                    : limits.tables?.limit || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-accent h-2 rounded-full"
                  style={{
                    width: `${
                      limits.tables?.limit === Infinity
                        ? 100
                        : Math.min(
                            ((limits.tables?.current || 0) /
                              (limits.tables?.limit || 1)) *
                              100,
                            100
                          )
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">{PLAN_NAMES.BASIC}</h3>
            <div className="text-3xl font-bold text-primary-accent mb-4">
              {PLAN_PRICES.BASIC}₺<span className="text-sm text-gray-600 font-normal">/yıl</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>4 Kategori</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Her kategoride 10 ürün (Toplam 40 ürün)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>5 Masa</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Temel sipariş takibi</span>
              </li>
            </ul>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handlePayment('BASIC')
              }}
              disabled={processingPayment || (isBasic && isLicenseValid)}
              className="w-full bg-primary-accent text-white py-3 rounded-lg hover:bg-primary-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>İşleniyor...</span>
                </>
              ) : isBasic && isLicenseValid ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Aktif Paket</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Basic Paketi Satın Al</span>
                </>
              )}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary-accent to-primary-accent/80 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              <h3 className="text-xl font-bold">{PLAN_NAMES.PREMIUM}</h3>
            </div>
            <div className="text-3xl font-bold mb-4">
              {PLAN_PRICES.PREMIUM}₺<span className="text-sm font-normal opacity-90">/yıl</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Sınırsız Kategori</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Sınırsız Ürün</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Sınırsız Masa</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Gelişmiş raporlar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Öncelikli destek</span>
              </li>
            </ul>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handlePayment('PREMIUM')
              }}
              disabled={processingPayment || (isPremium && isLicenseValid)}
              className="w-full bg-white text-primary-accent py-3 rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-accent"></div>
                  <span>İşleniyor...</span>
                </>
              ) : isPremium && isLicenseValid ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Aktif Paket</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Premium Paketi Satın Al</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

