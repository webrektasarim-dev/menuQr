'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Crown, Check } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
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
    }
  }, [router])

  const { data: planInfo, isLoading, error: planError } = useQuery({
    queryKey: ['plan-info'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/users/me/plan')
        return data
      } catch (error: any) {
        // If 401, don't throw - just return null
        if (error.response?.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
  })

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

  // If error or no plan info, show default values
  const isPremium = planInfo?.plan === 'PREMIUM' || false
  const limits = planInfo?.limits || {
    categories: { current: 0, limit: 5 },
    products: { current: 0, limit: 50 },
    tables: { current: 0, limit: 3 },
  }

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
        {/* Plan Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Mevcut Paket</h2>
            {isPremium && (
              <div className="flex items-center gap-2 text-primary-accent">
                <Crown className="w-6 h-6" />
                <span className="font-semibold">PREMIUM</span>
              </div>
            )}
            {!isPremium && (
              <span className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">
                FREE
              </span>
            )}
          </div>

          {!isPremium && (
            <div className="bg-primary-accent/10 border border-primary-accent rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Premium'a Geçin</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sınırsız kategori, ürün ve masa ile işletmenizi büyütün!
              </p>
              <button className="bg-primary-accent text-white px-6 py-2 rounded-lg hover:bg-primary-accent/90">
                Premium'a Geç
              </button>
            </div>
          )}

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
                <span className="font-medium">Ürünler</span>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">FREE Plan</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>5 Kategori</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>50 Ürün</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>3 Masa</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Temel sipariş takibi</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary-accent to-primary-accent/80 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6" />
              <h3 className="text-xl font-bold">PREMIUM Plan</h3>
            </div>
            <ul className="space-y-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}

