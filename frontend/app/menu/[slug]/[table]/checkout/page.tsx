'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCartStore } from '@/store/cart-store'
import { api } from '@/lib/api'
import { PaymentMethod } from '@prisma/client'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface CheckoutPageProps {
  params: Promise<{ slug: string; table: string }>
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug, table } = use(params)
  const router = useRouter()
  const { items, getTotal, clearCart, tableSlug, tableNumber } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CALL_WAITER
  )
  const [notes, setNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Get table by QR code
  const qrCode = `table-${table}`
  const { data: tableData } = useQuery({
    queryKey: ['table', qrCode],
    queryFn: async () => {
      const { data } = await api.get(`/tables/public/qr/${qrCode}`)
      return data
    },
    enabled: !!table,
  })

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: async (orderData: any) => {
      if (!tableData?.id) {
        throw new Error('Masa bulunamadı')
      }
      const { data } = await api.post('/orders', {
        ...orderData,
        tableId: tableData.id,
      })
      return data
    },
    onSuccess: () => {
      toast.success('Sipariş başarıyla oluşturuldu!')
      clearCart()
      router.push(`/menu/${slug}/${table}/success`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sipariş oluşturulamadı!')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Sepetiniz boş!')
      return
    }

    if (!tableData?.id) {
      toast.error('Masa bulunamadı!')
      return
    }

    const orderData = {
      tableId: tableData.id,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
        options: item.options,
      })),
      paymentMethod,
      notes,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
    }

    createOrder(orderData)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <div className="text-center">
          <p className="text-xl mb-4">Sepetiniz boş</p>
          <button
            onClick={() => router.push(`/menu/${slug}/${table}`)}
            className="text-primary-accent hover:underline"
          >
            Menüye Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-light py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-primary mb-6">Sipariş Özeti</h1>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Siparişiniz</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.productImage && (
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {item.price}₺
                  </p>
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                  )}
                </div>
                <div className="font-semibold">
                  {(item.price * item.quantity).toFixed(2)}₺
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Toplam:</span>
              <span className="text-primary-accent">{getTotal().toFixed(2)}₺</span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Masa Numarası
            </label>
            <input
              type="text"
              value={tableNumber || table}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ödeme Yöntemi
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent"
            >
              <option value={PaymentMethod.CALL_WAITER}>
                Masada Ödeme (Garson Çağır)
              </option>
              <option value={PaymentMethod.CASH}>Nakit</option>
              <option value={PaymentMethod.CARD}>Kart</option>
              <option value={PaymentMethod.ONLINE}>Online Ödeme</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad (Opsiyonel)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent"
              placeholder="İsim"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon (Opsiyonel)
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent"
              placeholder="05XX XXX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notlar (Opsiyonel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent"
              rows={3}
              placeholder="Özel istekleriniz..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Geri Dön
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition font-semibold disabled:opacity-50"
            >
              {isPending ? 'Sipariş Veriliyor...' : 'Sipariş Ver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

