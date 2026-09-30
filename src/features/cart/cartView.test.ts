import { describe, expect, it } from 'vitest'
import { priceCart } from '@/features/pricing'
import type { CartLine, Product } from '@/types'
import { buildCartLineViews } from './cartView'

const multi: Product = {
  id: 'p1',
  slug: 'p1',
  name: 'Producto',
  description: '',
  categoryId: 'c',
  image: { path: 'x', alt: 'x' },
  variants: [
    { id: 'v1', label: 'Chico', price: 1000 },
    { id: 'v2', label: 'Grande', price: 2000 },
  ],
  optionGroups: [
    {
      id: 'extras',
      label: 'Extras',
      type: 'multiple',
      required: false,
      choices: [{ id: 'e1', label: 'Extra uno', priceDelta: 100 }],
    },
  ],
}
const single: Product = {
  ...multi,
  id: 'p2',
  variants: [{ id: 'u', label: 'Único', price: 500 }],
  optionGroups: [],
}

function view(product: Product, line: CartLine) {
  const { lines } = priceCart([line], [product], [])
  return buildCartLineViews(lines, [line], [product])[0]
}

describe('buildCartLineViews', () => {
  it('arma nombre, variante y opciones legibles', () => {
    const v = view(multi, {
      lineId: 'l1',
      productId: 'p1',
      variantId: 'v2',
      selected: { extras: ['e1'] },
      qty: 2,
    })
    expect(v.productName).toBe('Producto')
    expect(v.variantLabel).toBe('Grande')
    expect(v.optionLabels).toEqual(['Extra uno'])
    expect(v.lineTotal).toBe(4200)
  })

  it('no muestra variante si el producto tiene una sola', () => {
    const v = view(single, {
      lineId: 'l2',
      productId: 'p2',
      variantId: 'u',
      selected: {},
      qty: 1,
    })
    expect(v.variantLabel).toBeNull()
  })
})
