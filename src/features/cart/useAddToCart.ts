import { useCallback } from 'react'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { useCart } from './CartContext'
import { useCartPanel } from './useCartPanel'

interface AddToCartInput {
  variantId: string
  selected?: Record<string, string[]>
  qty: number
}

export function useAddToCart() {
  const { addLine } = useCart()
  const { open: openCart } = useCartPanel()

  return useCallback(
    (product: Product, input: AddToCartInput) => {
      addLine({ productId: product.id, ...input })
      toast.success(`Agregado: ${input.qty} × ${product.name}`, {
        action: { label: 'Ver pedido', onClick: openCart },
      })
    },
    [addLine, openCart],
  )
}
