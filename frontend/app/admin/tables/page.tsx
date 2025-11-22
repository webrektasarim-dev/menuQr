'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, QrCode, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TablesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState<any>(null)

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

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    },
  })

  const { data: tables, isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/tables')
        return data || []
      } catch (error: any) {
        // If error, return empty array
        console.error('Error fetching tables:', error)
        return []
      }
    },
    retry: false,
  })

  const { mutate: createTable, isPending: isCreatingTable } = useMutation({
    mutationFn: async (tableData: any) => {
      const { data } = await api.post('/tables', tableData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success('Masa eklendi!')
      setShowModal(false)
      setEditingTable(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Masa eklenirken hata oluştu')
    },
  })

  const { mutate: updateTable, isPending: isUpdatingTable } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: response } = await api.patch(`/tables/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success('Masa güncellendi!')
      setShowModal(false)
      setEditingTable(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Masa güncellenirken hata oluştu')
    },
  })

  const { mutate: deleteTable, isPending: isDeletingTable } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tables/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success('Masa silindi!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Masa silinirken hata oluştu')
    },
  })

  const generateQRUrl = (table: any) => {
    if (!user?.slug) return ''
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/menu/${user.slug}/${table.number}`
  }

  const downloadQR = async (table: any) => {
    const qrUrl = generateQRUrl(table)
    if (!qrUrl) {
      toast.error('QR URL oluşturulamadı')
      return
    }

    try {
      // Generate QR code image using QR Server API
      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`
      
      // Create a temporary link to download the QR code
      const link = document.createElement('a')
      link.href = qrCodeImageUrl
      link.download = `QR-Masa-${table.number}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('QR kod indirildi!')
    } catch (error) {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(qrUrl)
      toast.success('QR URL kopyalandı!')
    }
  }

  const copyQRUrl = (table: any) => {
    const qrUrl = generateQRUrl(table)
    if (!qrUrl) {
      toast.error('QR URL oluşturulamadı')
      return
    }
    navigator.clipboard.writeText(qrUrl)
    toast.success('QR URL kopyalandı!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-light">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-primary-accent"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-primary">Masa & QR Yönetimi</h1>
            </div>
            <button
              onClick={() => {
                setEditingTable(null)
                setShowModal(true)
              }}
              className="bg-primary-accent text-white px-4 py-2 rounded-lg hover:bg-primary-accent/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Masa Ekle
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables?.map((table: any) => (
            <div
              key={table.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Masa #{table.number}</h3>
                  {table.name && (
                    <p className="text-gray-600 text-sm">{table.name}</p>
                  )}
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    table.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {table.isActive ? 'Aktif' : 'Pasif'}
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                {user?.slug && generateQRUrl(table) && (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generateQRUrl(table))}`}
                    alt={`QR Code for Table ${table.number}`}
                    className="mx-auto mb-2"
                  />
                )}
                <p className="text-xs text-gray-600 mb-1">QR URL:</p>
                <p className="text-sm font-mono break-all">
                  {generateQRUrl(table) || 'Yükleniyor...'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQR(table)}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  QR İndir
                </button>
                <button
                  onClick={() => copyQRUrl(table)}
                  className="bg-primary-accent text-white py-2 px-4 rounded-lg hover:bg-primary-accent/90"
                  title="URL Kopyala"
                >
                  📋
                </button>
                <button
                  onClick={() => {
                    setEditingTable(table)
                    setShowModal(true)
                  }}
                  className="bg-primary-accent text-white py-2 px-4 rounded-lg hover:bg-primary-accent/90"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bu masayı silmek istediğinize emin misiniz?')) {
                      deleteTable(table.id)
                    }
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!tables || tables.length === 0) && (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz masa yok</p>
          </div>
        )}
      </div>

      {/* Table Modal */}
      {showModal && (
        <TableModal
          table={editingTable}
          isPending={isCreatingTable || isUpdatingTable}
          onClose={() => {
            setShowModal(false)
            setEditingTable(null)
          }}
          onSave={(data) => {
            if (editingTable) {
              updateTable({ id: editingTable.id, data })
            } else {
              createTable(data)
            }
          }}
        />
      )}
    </div>
  )
}

// Table Modal Component
function TableModal({
  table,
  isPending,
  onClose,
  onSave,
}: {
  table: any
  isPending?: boolean
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    number: table?.number || '',
    name: table?.name || '',
    isActive: table?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">
          {table ? 'Masa Düzenle' : 'Yeni Masa'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Masa Numarası</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Masa Adı (Opsiyonel)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Bahçe Masası"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <span>Aktif</span>
            </label>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 disabled:opacity-50"
            >
              {isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

