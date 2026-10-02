import { useCallback } from 'react'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { useCart } from './CartContext'
import { useCartPanel } from './useCartPanel'
import { releaseFocus } from '@/lib/focus'

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
        action: {
          label: 'Ver pedido',
          onClick: () => {
            // sonner devuelve el foco al elemento previo cuando el foco sale de
            // su región. Si lo soltamos ANTES de abrir el panel, esa
            // restauración ocurre cuando todavía no hay nada con aria-hidden;
            // después de abrirlo, el foco ya estaba dentro del panel y
            // sonner lo devolvía a una card oculta.
            releaseFocus()
            openCart()
          },
        },
      })
    },
    [addLine, openCart],
  )
}
