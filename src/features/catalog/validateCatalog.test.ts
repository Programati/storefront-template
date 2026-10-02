import { describe, expect, it } from 'vitest'
import type { Catalog, PricingRule, Product } from '@/types'
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

const makeRule = (overrides: Partial<PricingRule> = {}): PricingRule => ({
  id: 'promo',
  match: { variantIds: ['v1'] },
  tiers: [{ minQty: 3, unitPrice: 900 }],
  ...overrides,
})

const makeCatalog = (
  products: Product[],
  pricingRules: PricingRule[] = [],
): Catalog => ({
  categories: [{ id: 'c1', slug: 'cat', name: 'Cat' }],
  products,
  pricingRules,
})

describe('validateCatalog: producto e imágenes', () => {
  it('un catálogo correcto no genera problemas', () => {
    expect(validateCatalog(makeCatalog([makeProduct()], [makeRule()]))).toEqual(
      [],
    )
  })

  it('un producto sin variantes es un error', () => {
    const issues = validateCatalog(makeCatalog([makeProduct({ variants: [] })]))
    expect(issues).toEqual([
      expect.objectContaining({ level: 'error', subject: 'p1' }),
    ])
    expect(issues[0].message).toMatch(/sin variantes/)
  })

  it('un alt vacío o solo con espacios es un error', () => {
    for (const alt of ['', '   ']) {
      const issues = validateCatalog(
        makeCatalog([makeProduct({ image: { path: 'a.webp', alt } })]),
      )
      expect(issues).toHaveLength(1)
      expect(issues[0]).toMatchObject({ level: 'error' })
      expect(issues[0].message).toMatch(/imagen principal/)
    }
  })

  it('un alt igual al nombre es una advertencia, sin importar mayúsculas ni espacios', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({ image: { path: 'a.webp', alt: '  PRODUCTO uno ' } }),
      ]),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'warning' })
  })

  it('revisa también la galería e indica cuál imagen falla', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({
          gallery: [
            { path: 'a-2.webp', alt: 'Vela encendida de noche' },
            { path: 'a-3.webp', alt: '' },
            { path: 'a-4.webp', alt: 'Producto Uno' },
          ],
        }),
      ]),
    )
    expect(issues).toHaveLength(2)
    expect(issues[0]).toMatchObject({ level: 'error' })
    expect(issues[0].message).toMatch(/galería #2/)
    expect(issues[1]).toMatchObject({ level: 'warning' })
    expect(issues[1].message).toMatch(/galería #3/)
  })

  it('junta los problemas de varios productos', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({ id: 'a', slug: 'a', variants: [] }),
        makeProduct({
          id: 'b',
          slug: 'b',
          variants: [{ id: 'vb', label: 'Único', price: 1 }],
          image: { path: 'b.webp', alt: '' },
        }),
      ]),
    )
    expect(issues.map((i) => i.subject)).toEqual(['a', 'b'])
  })
})

describe('validateCatalog: integridad', () => {
  it('un categoryId que no existe es un error', () => {
    const issues = validateCatalog(
      makeCatalog([makeProduct({ categoryId: 'no-existe' })]),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'error', subject: 'p1' })
    expect(issues[0].message).toMatch(/no-existe/)
  })

  it('ids de producto repetidos: un solo error por id', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({
          slug: 'a',
          variants: [{ id: 'va', label: 'U', price: 1 }],
        }),
        makeProduct({
          slug: 'b',
          variants: [{ id: 'vb', label: 'U', price: 1 }],
        }),
        makeProduct({
          slug: 'c',
          variants: [{ id: 'vc', label: 'U', price: 1 }],
        }),
      ]),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'error', subject: 'p1' })
    expect(issues[0].message).toMatch(/id de producto repetido/)
  })

  it('slugs repetidos son un error', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({
          id: 'a',
          variants: [{ id: 'va', label: 'U', price: 1 }],
        }),
        makeProduct({
          id: 'b',
          variants: [{ id: 'vb', label: 'U', price: 1 }],
        }),
      ]),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toMatch(/slug repetido: "producto-uno"/)
  })

  it('ids de variante repetidos entre productos son un error', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({ id: 'a', slug: 'a' }),
        makeProduct({ id: 'b', slug: 'b' }),
      ]),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toMatch(/id de variante repetido: "v1"/)
  })

  it('ids de variante repetidos dentro de un mismo producto también', () => {
    const issues = validateCatalog(
      makeCatalog([
        makeProduct({
          variants: [
            { id: 'v1', label: 'Chico', price: 1 },
            { id: 'v1', label: 'Grande', price: 2 },
          ],
        }),
      ]),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toMatch(/id de variante repetido/)
  })
})

describe('validateCatalog: reglas de precio', () => {
  it('una regla que apunta a una variante inexistente es un error', () => {
    const issues = validateCatalog(
      makeCatalog(
        [makeProduct()],
        [makeRule({ match: { variantIds: ['v1', 'v1-typo'] } })],
      ),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'error', subject: 'regla:promo' })
    expect(issues[0].message).toMatch(/v1-typo/)
  })

  it('una regla que apunta a un producto inexistente es un error', () => {
    const issues = validateCatalog(
      makeCatalog(
        [makeProduct()],
        [makeRule({ match: { productIds: ['p1', 'p-fantasma'] } })],
      ),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toMatch(/p-fantasma/)
  })

  it('informa cada referencia rota por separado', () => {
    const issues = validateCatalog(
      makeCatalog(
        [makeProduct()],
        [makeRule({ match: { productIds: ['x'], variantIds: ['y'] } })],
      ),
    )
    expect(issues).toHaveLength(2)
  })
})
