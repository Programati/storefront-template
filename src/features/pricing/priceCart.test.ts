// src/features/pricing/priceCart.test.ts
import { describe, expect, it } from 'vitest'
import type { CartLine, PricingRule, Product } from '@/types'
import { priceCart } from './priceCart'

const marmolado: Product = {
  id: 'budin-marmolado',
  slug: 'budin-marmolado',
  name: 'Budín marmolado',
  description: '',
  categoryId: 'budines',
  image: { path: 'x', alt: '' },
  variants: [
    { id: 'mediano', label: 'Mediano', price: 4500 },
    { id: 'grande', label: 'Grande', price: 8000 },
  ],
  optionGroups: [
    {
      id: 'extras',
      label: 'Extras',
      type: 'multiple',
      required: false,
      choices: [{ id: 'chips', label: 'Chips de chocolate', priceDelta: 500 }],
    },
  ],
}

const vainilla: Product = {
  ...marmolado,
  id: 'budin-vainilla',
  slug: 'budin-vainilla',
  name: 'Budín vainilla',
}
const products = [marmolado, vainilla]

const volumeRule: PricingRule = {
  id: 'promo-grandes',
  match: { variantIds: ['grande'] },
  tiers: [
    { minQty: 4, unitPrice: 7500 },
    { minQty: 6, unitPrice: 7000 },
  ],
}

let counter = 0
function line(overrides: Partial<CartLine>): CartLine {
  counter += 1
  return {
    lineId: `line-${counter}`,
    productId: marmolado.id,
    variantId: 'grande',
    selected: {},
    qty: 1,
    ...overrides,
  }
}

describe('priceCart', () => {
  it('no aplica descuento por debajo del primer escalón', () => {
    const { totals } = priceCart([line({ qty: 2 })], products, [volumeRule])
    expect(totals.total).toBe(16000) // 2 × 8000
    expect(totals.discount).toBe(0)
  })

  it('aplica el escalón de 4 aunque sean de distinto sabor (mismo variantId)', () => {
    const lines: CartLine[] = [
      line({ productId: marmolado.id, qty: 2 }),
      line({ productId: vainilla.id, qty: 2 }),
    ]
    const { totals } = priceCart(lines, products, [volumeRule])
    expect(totals.total).toBe(30000) // 4 × 7500
    expect(totals.discount).toBe(2000) // (8000 - 7500) × 4
  })

  it('aplica el escalón de 6 cuando se supera esa cantidad', () => {
    const { totals } = priceCart([line({ qty: 6 })], products, [volumeRule])
    expect(totals.total).toBe(42000) // 6 × 7000
  })

  it('no afecta a la variante mediana', () => {
    const { totals } = priceCart(
      [line({ variantId: 'mediano', qty: 6 })],
      products,
      [volumeRule],
    )
    expect(totals.total).toBe(27000) // 6 × 4500, sin promo
  })

  it('suma los extras por unidad sin que el volumen los afecte', () => {
    const { lines } = priceCart(
      [line({ qty: 4, selected: { extras: ['chips'] } })],
      products,
      [volumeRule],
    )
    expect(lines[0].unitPrice).toBe(8000) // 7500 (promo) + 500 (chips)
    expect(lines[0].lineTotal).toBe(32000)
  })

  it('lanza un error si la línea referencia un producto inexistente', () => {
    expect(() =>
      priceCart([line({ productId: 'no-existe' })], products, [volumeRule]),
    ).toThrow(/no encontrado/)
  })
})
