'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MenuPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)

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

  // Get menu with categories and products
  const { data: menu, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/menus')
        return data
      } catch (error: any) {
        // If 404, menu doesn't exist yet (this is normal)
        if (error.response?.status === 404 || error.response?.status === 400) {
          return null
        }
        throw error
      }
    },
    retry: false,
  })

  // Create menu if doesn't exist
  const { mutate: createMenu } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/menus', { name: 'Menü' })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Menü oluşturuldu!')
    },
  })

  // Create category
  const { mutate: createCategory, isPending: isCreatingCategory } = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data } = await api.post('/categories', categoryData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Kategori eklendi!')
      setShowCategoryModal(false)
      setEditingCategory(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Kategori eklenirken hata oluştu')
    },
  })

  // Update category
  const { mutate: updateCategory } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: response } = await api.patch(`/categories/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Kategori güncellendi!')
      setShowCategoryModal(false)
      setEditingCategory(null)
    },
  })

  // Delete category
  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Kategori silindi!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Kategori silinirken hata oluştu')
    },
  })

  // Create product
  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: async (productData: any) => {
      const { data } = await api.post('/products', productData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Ürün eklendi!')
      setShowProductModal(false)
      setEditingProduct(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ürün eklenirken hata oluştu')
    },
  })

  // Update product
  const { mutate: updateProduct } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: response } = await api.patch(`/products/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Ürün güncellendi!')
      setShowProductModal(false)
      setEditingProduct(null)
    },
  })

  // Delete product
  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      toast.success('Ürün silindi!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ürün silinirken hata oluştu')
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <div className="text-center">
          <p className="text-xl mb-4">Menü bulunamadı</p>
          <button
            onClick={() => createMenu()}
            className="bg-primary-accent text-white px-6 py-3 rounded-lg hover:bg-primary-accent/90"
          >
            Menü Oluştur
          </button>
        </div>
      </div>
    )
  }

  const categories = menu.categories || []
  const allProducts = categories.flatMap((cat: any) =>
    cat.products?.map((p: any) => ({ ...p, categoryId: cat.id })) || []
  )

  const filteredProducts =
    selectedCategory === null
      ? allProducts
      : allProducts.filter((p: any) => p.categoryId === selectedCategory)

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
              <h1 className="text-2xl font-bold text-primary">Menü Yönetimi</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCategory(null)
                  setShowCategoryModal(true)
                }}
                className="bg-primary-accent text-white px-4 py-2 rounded-lg hover:bg-primary-accent/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Kategori Ekle
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setShowProductModal(true)
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ürün Ekle
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Kategoriler</h2>
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === null
                  ? 'bg-primary-accent text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Tümü
            </button>
            {categories.map((category: any) => (
              <div key={category.id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category.id
                      ? 'bg-primary-accent text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {category.name}
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(category)
                    setShowCategoryModal(true)
                  }}
                  className="p-2 text-gray-600 hover:text-primary-accent"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`${category.name} kategorisini silmek istediğinize emin misiniz? Bu kategorideki tüm ürünler de silinecektir.`)) {
                      deleteCategory(category.id)
                    }
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Ürünler</h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
              )}
              <p className="text-2xl font-bold text-primary-accent mb-4">
                {product.price}₺
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product)
                    setShowProductModal(true)
                  }}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
                      deleteProduct(product.id)
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz ürün yok</p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          isPending={isCreatingCategory}
          onClose={() => {
            setShowCategoryModal(false)
            setEditingCategory(null)
          }}
          onSave={(data) => {
            if (editingCategory) {
              updateCategory({ id: editingCategory.id, data })
            } else {
              createCategory(data)
            }
          }}
        />
      )}

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          isPending={isCreatingProduct}
          onClose={() => {
            setShowProductModal(false)
            setEditingProduct(null)
          }}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct({ id: editingProduct.id, data })
            } else {
              createProduct(data)
            }
          }}
        />
      )}
    </div>
  )
}

// Category Modal Component
function CategoryModal({
  category,
  isPending,
  onClose,
  onSave,
}: {
  category: any
  isPending?: boolean
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    icon: category?.icon || '',
    order: category?.order || 0,
    isActive: category?.isActive ?? true,
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
          {category ? 'Kategori Düzenle' : 'Yeni Kategori'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kategori Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sıra</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
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

// Product Modal Component
function ProductModal({
  product,
  categories,
  isPending,
  onClose,
  onSave,
}: {
  product: any
  categories: any[]
  isPending?: boolean
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    categoryId: product?.categoryId || categories[0]?.id || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image: product?.image || '',
    allergens: product?.allergens || [],
    isPopular: product?.isPopular || false,
    isVegan: product?.isVegan || false,
    isAvailable: product?.isAvailable ?? true,
    stock: product?.stock || null,
    order: product?.order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Ürün Düzenle' : 'Yeni Ürün'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ürün Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fiyat (₺)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sıra</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Resim URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) =>
                  setFormData({ ...formData, isPopular: e.target.checked })
                }
              />
              <span>Popüler</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isVegan}
                onChange={(e) =>
                  setFormData({ ...formData, isVegan: e.target.checked })
                }
              />
              <span>Vegan</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
              />
              <span>Mevcut</span>
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

