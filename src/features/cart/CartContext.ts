import { createContext, useContext } from 'react'
import type { CartLine } from '@/types'
import type { CartTotals, PricedLine } from '@/features/pricing'

export interface AddLineInput {
  productId: string
  variantId: string
  selected?: Record<string, string[]>
  qty?: number
}

export interface CartContextValue {
  lines: CartLine[]
  pricedLines: PricedLine[]
  totals: CartTotals
  isEmpty: boolean
  addLine: (input: AddLineInput) => void
  setQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return ctx
}
