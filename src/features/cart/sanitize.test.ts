import { describe, expect, it } from 'vitest'
import type { CartLine, Product } from '@/types'
import { sanitizeCartLines } from './sanitize'

const active: Product = {
  id: 'p1',
  slug: 'p1',
  name: 'Activo',
  description: '',
  categoryId: 'c',
  image: { path: 'x', alt: '' },
  variants: [{ id: 'v1', label: 'Único', price: 1000 }],
  optionGroups: [],
}
const soldOut: Product = { ...active, id: 'p2', slug: 'p2', soldOut: true }

describe('sanitizeCartLines', () => {
  it('descarta líneas de productos que ya no existen', () => {
    const lines: CartLine[] = [
      {
        lineId: 'l1',
        productId: 'no-existe',
        variantId: 'v1',
        selected: {},
        qty: 1,
      },
    ]
    expect(sanitizeCartLines(lines, [active], 100)).toEqual([])
  })

  it('descarta líneas de productos agotados', () => {
    const lines: CartLine[] = [
      { lineId: 'l1', productId: 'p2', variantId: 'v1', selected: {}, qty: 1 },
    ]
    expect(sanitizeCartLines(lines, [soldOut], 100)).toEqual([])
  })

  it('recorta la cantidad al máximo vigente', () => {
    const lines: CartLine[] = [
      {
        lineId: 'l1',
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 500,
      },
    ]
    expect(sanitizeCartLines(lines, [active], 100)[0].qty).toBe(100)
  })
})
