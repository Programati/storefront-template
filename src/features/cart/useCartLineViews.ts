import { useMemo } from 'react'
import { useCatalog } from '@/app/store'
import { useCart } from './CartContext'
import { buildCartLineViews, type CartLineView } from './cartView'

export function useCartLineViews(): CartLineView[] {
  const { pricedLines, lines } = useCart()
  const catalog = useCatalog()
  return useMemo(
    () => buildCartLineViews(pricedLines, lines, catalog.products),
    [pricedLines, lines, catalog.products],
  )
}
