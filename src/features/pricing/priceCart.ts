import type { CartLine, PricingRule, Product } from '@/types'
import { getExtrasUnitDelta } from './extras'
import { cartTotals } from './cartTotals'
import type { CartTotals, PricedLine } from './types'

function findMatchingRule(
  productId: string,
  variantId: string,
  pricingRules: PricingRule[],
): PricingRule | undefined {
  return pricingRules.find(
    (rule) =>
      rule.match.variantIds?.includes(variantId) ||
      rule.match.productIds?.includes(productId),
  )
}

function resolveTierUnitPrice(rule: PricingRule, qty: number): number | null {
  const applicable = rule.tiers
    .filter((tier) => qty >= tier.minQty)
    .sort((a, b) => b.minQty - a.minQty) // el escalón más alto que se cumple, gana
  return applicable[0]?.unitPrice ?? null
}

export function priceCart(
  cartLines: CartLine[],
  products: Product[],
  pricingRules: PricingRule[],
): { lines: PricedLine[]; totals: CartTotals } {
  const productById = new Map(products.map((p) => [p.id, p]))

  // Pasada 1: cuánto aporta cada línea a cada regla, sumado entre TODAS
  // las líneas del carrito — no por línea individual.
  const qtyByRule = new Map<string, number>()
  for (const line of cartLines) {
    const product = productById.get(line.productId)
    if (!product) continue
    const rule = findMatchingRule(product.id, line.variantId, pricingRules)
    if (!rule) continue
    qtyByRule.set(rule.id, (qtyByRule.get(rule.id) ?? 0) + line.qty)
  }

  // Pasada 2: tasar cada línea con esa cantidad ya agregada.
  const lines: PricedLine[] = cartLines.map((line) => {
    const product = productById.get(line.productId)
    if (!product) {
      throw new Error(
        `Producto "${line.productId}" no encontrado (línea "${line.lineId}")`,
      )
    }
    const variant = product.variants.find((v) => v.id === line.variantId)
    if (!variant) {
      throw new Error(
        `Variante "${line.variantId}" no encontrada en "${product.id}"`,
      )
    }

    const rule = findMatchingRule(product.id, line.variantId, pricingRules)
    const extrasDelta = getExtrasUnitDelta(product, line.selected)
    const baseUnitPrice = variant.price + extrasDelta

    const aggregateQty = rule ? (qtyByRule.get(rule.id) ?? line.qty) : line.qty
    const tierUnitPrice = rule ? resolveTierUnitPrice(rule, aggregateQty) : null
    const unitPrice = (tierUnitPrice ?? variant.price) + extrasDelta

    return {
      lineId: line.lineId,
      productId: product.id,
      variantId: variant.id,
      qty: line.qty,
      baseUnitPrice,
      unitPrice,
      lineTotal: unitPrice * line.qty,
      lineSavings: (baseUnitPrice - unitPrice) * line.qty,
    }
  })

  return { lines, totals: cartTotals(lines) }
}
