import { useMemo, useState } from 'react'
import { useCatalog, useStoreConfig } from '@/app/store'
import { priceCart } from '@/features/pricing'
import type { CartLine, OptionGroup, Product } from '@/types'
import { useCart } from './CartContext'
import {
  cleanSelection,
  getMissingRequiredGroups,
  toggleChoice,
  type Selection,
} from './productSelection'

const PREVIEW_LINE_ID = '__preview__'

export function useProductSelection(product: Product) {
  const config = useStoreConfig()
  const catalog = useCatalog()
  const cart = useCart()

  // Se asume al menos una variante por producto (lo validaremos en la Fase 13).
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [selected, setSelected] = useState<Selection>({})
  const [qty, setQty] = useState(1)

  const missing = useMemo(
    () => getMissingRequiredGroups(product, selected),
    [product, selected],
  )
  const cleanedSelection = useMemo(() => cleanSelection(selected), [selected])

  // Precio real de ESTA línea si se agregara ahora: usamos el mismo motor del
  // carrito sobre un carrito hipotético, así la promo por volumen se ve en vivo.
  const preview = useMemo(() => {
    const candidate: CartLine = {
      lineId: PREVIEW_LINE_ID,
      productId: product.id,
      variantId,
      selected: cleanedSelection,
      qty,
    }
    const { lines } = priceCart(
      [...cart.lines, candidate],
      catalog.products,
      catalog.pricingRules,
    )
    return lines[lines.length - 1]
  }, [
    cart.lines,
    catalog.products,
    catalog.pricingRules,
    product.id,
    variantId,
    cleanedSelection,
    qty,
  ])

  function toggle(group: OptionGroup, choiceId: string) {
    setSelected((prev) => ({
      ...prev,
      [group.id]: toggleChoice(group, choiceId, prev[group.id]),
    }))
  }

  return {
    variantId,
    setVariantId,
    selected,
    cleanedSelection,
    toggle,
    qty,
    setQty,
    maxQty: config.maxQtyPerLine,
    missing,
    isValid: missing.length === 0,
    preview,
  }
}
