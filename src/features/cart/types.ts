import type { CartLine } from '@/types'

export interface CartState {
  lines: CartLine[]
}

export type CartAction =
  | {
      type: 'ADD_LINE'
      payload: {
        productId: string
        variantId: string
        selected: Record<string, string[]>
        qty: number
        maxQty: number
      }
    }
  | {
      type: 'SET_QTY'
      payload: { lineId: string; qty: number; maxQty: number }
    }
  | { type: 'REMOVE_LINE'; payload: { lineId: string } }
  | { type: 'CLEAR' }
  | { type: 'REPLACE'; payload: { lines: CartLine[] } }
