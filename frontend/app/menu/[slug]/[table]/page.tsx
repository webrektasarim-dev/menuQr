'use client'

import { use, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCartStore } from '@/store/cart-store'
import CategoryTabs from '@/components/menu/CategoryTabs'
import ProductCard from '@/components/menu/ProductCard'
import CartSidebar from '@/components/menu/CartSidebar'
import { ShoppingCart } from 'lucide-react'

interface MenuPageProps {
  params: Promise<{ slug: string; table: string }>
}

export default function MenuPage({ params }: MenuPageProps) {
  const { slug, table } = use(params)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const { setTable, getItemCount, getTotal, items } = useCartStore()

  useEffect(() => {
    setTable(slug, table)
  }, [slug, table, setTable])

  const { data: menu, isLoading, error } = useQuery({
    queryKey: ['menu', slug],
    queryFn: async () => {
      const { data } = await api.get(`/menus/public/${slug}`)
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Menü bulunamadı</div>
          <div className="text-gray-600">
            Lütfen QR kodu tekrar tarayın veya işletme ile iletişime geçin.
          </div>
        </div>
      </div>
    )
  }

  const categories = menu.categories || []
  const allProducts = categories.flatMap((cat: any) =>
    cat.products?.map((p: any) => ({ ...p, categoryId: cat.id })) || []
  )

  const filteredProducts =
    activeCategory === null
      ? allProducts
      : allProducts.filter((p: any) => p.categoryId === activeCategory)

  return (
    <div className="min-h-screen bg-primary-light pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {menu.name || 'Menü'}
              </h1>
              <p className="text-sm text-gray-600">Masa #{table}</p>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-primary-accent text-white p-3 rounded-lg hover:bg-primary-accent/90 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Bu kategoride ürün bulunamadı
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          window.location.href = `/menu/${slug}/${table}/checkout`
        }}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

// Product Detail Modal Component
function ProductDetailModal({
  product,
  onClose,
}: {
  product: any
  onClose: () => void
}) {
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({})
  const [notes, setNotes] = useState('')

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity,
      options: selectedOptions,
      notes,
    })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {product.image && (
            <div className="relative w-full h-64 bg-gray-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}

            <div className="text-3xl font-bold text-primary-accent mb-6">
              {product.price}₺
            </div>

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.options.map((option: any) => (
                  <div key={option.id}>
                    <label className="block font-semibold mb-2">
                      {option.name}
                      {option.price > 0 && (
                        <span className="text-sm text-gray-600 ml-2">
                          (+{option.price}₺)
                        </span>
                      )}
                    </label>
                    <input
                      type={option.isRequired ? 'radio' : 'checkbox'}
                      name={option.type}
                      onChange={(e) => {
                        if (option.isRequired) {
                          setSelectedOptions({
                            ...selectedOptions,
                            [option.type]: option.name,
                          })
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Notlar</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={3}
                placeholder="Özel istekleriniz..."
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                İptal
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition font-semibold"
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
