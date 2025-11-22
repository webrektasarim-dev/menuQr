'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import {
  ShoppingCart,
  Package,
  Settings,
  TrendingUp,
  Menu as MenuIcon,
  QrCode,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Only check on client side
    if (typeof window === 'undefined') return
    
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/auth/login')
    }
  }, [router])

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [menuRes, tablesRes, ordersRes] = await Promise.all([
        api.get('/menus').catch(() => ({ data: null })),
        api.get('/tables').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] })),
      ])

      const orders = ordersRes.data || []
      const todayOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt)
        const today = new Date()
        return orderDate.toDateString() === today.toDateString()
      })

      return {
        menu: menuRes.data ? 1 : 0,
        tables: tablesRes.data?.length || 0,
        orders: orders.length,
        todayOrders: todayOrders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0),
      }
    },
    enabled: !!user,
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Yönetim Paneli</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.businessName}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('user')
                  router.push('/auth/login')
                }}
                className="text-gray-600 hover:text-primary-accent"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Sipariş</p>
                <p className="text-3xl font-bold text-primary">
                  {stats?.orders || 0}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-primary-accent" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bugünkü Siparişler</p>
                <p className="text-3xl font-bold text-primary">
                  {stats?.todayOrders || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Gelir</p>
                <p className="text-3xl font-bold text-primary">
                  {stats?.totalRevenue?.toFixed(2) || 0}₺
                </p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Masalar</p>
                <p className="text-3xl font-bold text-primary">
                  {stats?.tables || 0}
                </p>
              </div>
              <QrCode className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/menu"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <MenuIcon className="w-8 h-8 text-primary-accent mb-3" />
            <h3 className="text-xl font-semibold mb-2">Menü Yönetimi</h3>
            <p className="text-gray-600 text-sm">
              Ürünlerinizi ekleyin, düzenleyin ve kategorilerinizi yönetin
            </p>
          </Link>

          <Link
            href="/admin/tables"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <QrCode className="w-8 h-8 text-primary-accent mb-3" />
            <h3 className="text-xl font-semibold mb-2">Masa & QR Yönetimi</h3>
            <p className="text-gray-600 text-sm">
              Masalarınızı ekleyin ve QR kodlarını indirin
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <ShoppingCart className="w-8 h-8 text-primary-accent mb-3" />
            <h3 className="text-xl font-semibold mb-2">Siparişler</h3>
            <p className="text-gray-600 text-sm">
              Gelen siparişleri görüntüleyin ve yönetin
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <Settings className="w-8 h-8 text-primary-accent mb-3" />
            <h3 className="text-xl font-semibold mb-2">Ayarlar & Paket</h3>
            <p className="text-gray-600 text-sm">
              Paket bilgilerinizi görüntüleyin ve yönetin
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

