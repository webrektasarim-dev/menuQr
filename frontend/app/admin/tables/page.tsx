'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, QrCode, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { use } from 'react'

export default function TablesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
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
      const { data } = await api.get('/tables')
      return data
    },
  })

  const { mutate: createTable } = useMutation({
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
  })

  const { mutate: updateTable } = useMutation({
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
  })

  const { mutate: deleteTable } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tables/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success('Masa silindi!')
    },
  })

  const generateQRUrl = (table: any) => {
    if (!user?.slug) return ''
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/menu/${user.slug}/${table.number}`
  }

  const downloadQR = (table: any) => {
    const qrUrl = generateQRUrl(table)
    if (!qrUrl) {
      toast.error('QR URL oluşturulamadı')
      return
    }

    // Create QR code image using a QR code API or library
    // For now, we'll copy the URL to clipboard
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

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">QR URL:</p>
                <p className="text-sm font-mono break-all">
                  {generateQRUrl(table)}
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
  onClose,
  onSave,
}: {
  table: any
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
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

