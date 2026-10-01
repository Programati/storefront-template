import { useStoreConfig } from '@/app/store'
import { useAddToCart } from '@/features/cart'
import { useProductPanel } from '@/features/catalog'
import type { Product } from '@/types'

// Las páginas son la capa que une catálogo + carrito + config.
export function useProductGridProps() {
  const config = useStoreConfig()
  const addToCart = useAddToCart()
  const productPanel = useProductPanel()

  return {
    currency: config.currency,
    maxQty: config.maxQtyPerLine,
    look: config.cardLook,
    onAdd: (product: Product, variantId: string, qty: number) =>
      addToCart(product, { variantId, qty }),
    onOpenOptions: (product: Product) => productPanel.open(product.slug),
  }
}
