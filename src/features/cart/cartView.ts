import type { PricedLine } from '@/features/pricing'
import type { CartLine, Product, ProductImage } from '@/types'

export interface CartLineView {
  lineId: string
  productId: string
  productName: string
  image: ProductImage
  variantLabel: string | null // null si el producto tiene una sola variante
  optionLabels: string[]
  qty: number
  unitPrice: number
  baseUnitPrice: number
  lineTotal: number
  lineSavings: number
}

export function buildCartLineViews(
  pricedLines: PricedLine[],
  cartLines: CartLine[],
  products: Product[],
): CartLineView[] {
  const productById = new Map(products.map((p) => [p.id, p]))
  const cartLineById = new Map(cartLines.map((l) => [l.lineId, l]))

  return pricedLines.flatMap((priced) => {
    const product = productById.get(priced.productId)
    const cartLine = cartLineById.get(priced.lineId)
    if (!product || !cartLine) return []

    const variant = product.variants.find((v) => v.id === priced.variantId)
    const optionLabels = product.optionGroups.flatMap((group) =>
      group.choices
        .filter((choice) =>
          (cartLine.selected[group.id] ?? []).includes(choice.id),
        )
        .map((choice) => choice.label),
    )

    return [
      {
        lineId: priced.lineId,
        productId: product.id,
        productName: product.name,
        image: product.image,
        variantLabel:
          product.variants.length > 1 ? (variant?.label ?? null) : null,
        optionLabels,
        qty: priced.qty,
        unitPrice: priced.unitPrice,
        baseUnitPrice: priced.baseUnitPrice,
        lineTotal: priced.lineTotal,
        lineSavings: priced.lineSavings,
      },
    ]
  })
}
