'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  isPopular?: boolean
  isVegan?: boolean
  allergens?: string[]
}

interface ProductCardProps {
  product: Product
  onSelect?: () => void
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity: 1,
    })
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={onSelect}
    >
      {product.image ? (
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Fotoğraf yok</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
          {product.isPopular && (
            <span className="bg-primary-accent text-white text-xs px-2 py-1 rounded">
              Popüler
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-accent">
              {product.price}₺
            </p>
            {product.isVegan && (
              <span className="text-xs text-green-600">🌱 Vegan</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
            className="bg-primary-accent text-white p-2 rounded-lg hover:bg-primary-accent/90 transition"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

