'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'
import { OrderStatus } from '@prisma/client'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

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

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data } = await api.patch(`/orders/${id}`, { status })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Sipariş durumu güncellendi!')
      setSelectedOrder(null)
    },
  })

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', selectedStatus],
    queryFn: async () => {
      try {
        const params = selectedStatus ? `?status=${selectedStatus}` : ''
        const { data } = await api.get(`/orders${params}`)
        return data || []
      } catch (error: any) {
        // If error, return empty array
        console.error('Error fetching orders:', error)
        return []
      }
    },
    retry: false,
  })

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.PREPARING:
      case OrderStatus.READY:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.PENDING:
      case OrderStatus.CONFIRMED:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5" />
      case OrderStatus.CANCELLED:
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
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
            <h1 className="text-2xl font-bold text-primary">Siparişler</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus(undefined)}
            className={`px-4 py-2 rounded-lg ${
              !selectedStatus
                ? 'bg-primary-accent text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Tümü
          </button>
          {Object.values(OrderStatus).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg ${
                selectedStatus === status
                  ? 'bg-primary-accent text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Henüz sipariş yok</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Masa #{order.table?.number || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium">{order.status}</span>
                  </div>
                </div>

                <div className="mb-4">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {item.price}₺
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)}₺
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Ödeme: {order.paymentMethod || 'Belirtilmedi'}
                    </p>
                    {order.customerName && (
                      <p className="text-sm text-gray-600">
                        Müşteri: {order.customerName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-accent">
                      {order.totalAmount.toFixed(2)}₺
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Detay
                  </button>
                  {order.status === OrderStatus.PENDING && (
                    <button
                      onClick={() =>
                        updateOrderStatus({ id: order.id, status: OrderStatus.CONFIRMED })
                      }
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                    >
                      Onayla
                    </button>
                  )}
                  {order.status === OrderStatus.CONFIRMED && (
                    <button
                      onClick={() =>
                        updateOrderStatus({ id: order.id, status: OrderStatus.PREPARING })
                      }
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                      Hazırlanıyor
                    </button>
                  )}
                  {order.status === OrderStatus.PREPARING && (
                    <button
                      onClick={() =>
                        updateOrderStatus({ id: order.id, status: OrderStatus.READY })
                      }
                      className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600"
                    >
                      Hazır
                    </button>
                  )}
                  {order.status === OrderStatus.READY && (
                    <button
                      onClick={() =>
                        updateOrderStatus({ id: order.id, status: OrderStatus.COMPLETED })
                      }
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                    >
                      Tamamla
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(status) =>
            updateOrderStatus({ id: selectedOrder.id, status })
          }
        />
      )}
    </div>
  )
}

// Order Detail Modal
function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: any
  onClose: () => void
  onUpdateStatus: (status: OrderStatus) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sipariş Detayı</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Masa</p>
            <p className="font-semibold">#{order.table?.number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Durum</p>
            <p className="font-semibold">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tarih</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleString('tr-TR')}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Ürünler</h3>
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {item.price}₺
                  </p>
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                  )}
                </div>
                <p className="font-semibold">
                  {(item.price * item.quantity).toFixed(2)}₺
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Toplam</p>
              <p className="text-2xl font-bold text-primary-accent">
                {order.totalAmount.toFixed(2)}₺
              </p>
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-sm text-gray-600">Notlar</p>
              <p className="font-medium">{order.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {order.status === OrderStatus.PENDING && (
              <button
                onClick={() => {
                  onUpdateStatus(OrderStatus.CONFIRMED)
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Onayla
              </button>
            )}
            {order.status === OrderStatus.CONFIRMED && (
              <button
                onClick={() => {
                  onUpdateStatus(OrderStatus.PREPARING)
                }}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Hazırlanıyor
              </button>
            )}
            {order.status === OrderStatus.PREPARING && (
              <button
                onClick={() => {
                  onUpdateStatus(OrderStatus.READY)
                }}
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
              >
                Hazır
              </button>
            )}
            {order.status === OrderStatus.READY && (
              <button
                onClick={() => {
                  onUpdateStatus(OrderStatus.COMPLETED)
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Tamamla
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

