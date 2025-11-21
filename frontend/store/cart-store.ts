import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  price: number
  quantity: number
  options?: Record<string, any>
  notes?: string
}

interface CartStore {
  items: CartItem[]
  tableSlug?: string
  tableNumber?: string
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setTable: (slug: string, number: string) => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableSlug: undefined,
      tableNumber: undefined,

      addItem: (item) => {
        const id = `${item.productId}-${JSON.stringify(item.options || {})}`
        const existingItem = get().items.find((i) => i.id === id)

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({
            items: [...get().items, { ...item, id }],
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      setTable: (slug, number) => {
        set({ tableSlug: slug, tableNumber: number })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cafeqr-cart',
    }
  )
)

