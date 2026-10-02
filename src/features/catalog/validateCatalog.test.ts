import { describe, expect, it } from 'vitest'
import type { Catalog, Product } from '@/types'
import { validateCatalog } from './validateCatalog'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  slug: 'producto-uno',
  name: 'Producto Uno',
  description: 'Descripción',
  categoryId: 'c1',
  image: { path: 'products/producto-uno.webp', alt: 'Vela de soja en frasco' },
  variants: [{ id: 'v1', label: 'Único', price: 1000 }],
  optionGroups: [],
  ...overrides,
})

const makeCatalog = (...products: Product[]): Catalog => ({
  categories: [{ id: 'c1', slug: 'cat', name: 'Cat' }],
  products,
  pricingRules: [],
})

describe('validateCatalog', () => {
  it('un producto correcto no genera problemas', () => {
    expect(validateCatalog(makeCatalog(makeProduct()))).toEqual([])
  })

  it('un producto sin variantes es un error', () => {
    const issues = validateCatalog(makeCatalog(makeProduct({ variants: [] })))
    expect(issues).toEqual([
      expect.objectContaining({ level: 'error', productId: 'p1' }),
    ])
    expect(issues[0].message).toMatch(/sin variantes/)
  })

  it('un alt vacío o solo con espacios es un error', () => {
    for (const alt of ['', '   ']) {
      const issues = validateCatalog(
        makeCatalog(makeProduct({ image: { path: 'a.webp', alt } })),
      )
      expect(issues).toHaveLength(1)
      expect(issues[0]).toMatchObject({ level: 'error' })
      expect(issues[0].message).toMatch(/imagen principal/)
    }
  })

  it('un alt igual al nombre es una advertencia, sin importar mayúsculas ni espacios', () => {
    const issues = validateCatalog(
      makeCatalog(
        makeProduct({ image: { path: 'a.webp', alt: '  PRODUCTO uno ' } }),
      ),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'warning' })
  })

  it('revisa también las imágenes de la galería e indica cuál falla', () => {
    const issues = validateCatalog(
      makeCatalog(
        makeProduct({
          gallery: [
            { path: 'a-2.webp', alt: 'Vela encendida de noche' },
            { path: 'a-3.webp', alt: '' },
            { path: 'a-4.webp', alt: 'Producto Uno' },
          ],
        }),
      ),
    )
    expect(issues).toHaveLength(2)
    expect(issues[0]).toMatchObject({ level: 'error' })
    expect(issues[0].message).toMatch(/galería #2/)
    expect(issues[1]).toMatchObject({ level: 'warning' })
    expect(issues[1].message).toMatch(/galería #3/)
  })

  it('junta los problemas de varios productos', () => {
    const issues = validateCatalog(
      makeCatalog(
        makeProduct({ id: 'a', variants: [] }),
        makeProduct({ id: 'b', image: { path: 'b.webp', alt: '' } }),
      ),
    )
    expect(issues.map((i) => i.productId)).toEqual(['a', 'b'])
  })
})
