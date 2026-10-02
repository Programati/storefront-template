import { describe, expect, it } from 'vitest'
import {
  expectedImages,
  invalidCatalogPaths,
  planImages,
  splitInputs,
  type ExpectedImage,
} from './plan'

const alfa: ExpectedImage = {
  name: 'producto-alfa',
  path: 'products/producto-alfa.webp',
  productName: 'Producto Alfa',
}
const beta: ExpectedImage = {
  name: 'producto-beta',
  path: 'products/producto-beta.webp',
  productName: 'Producto Beta',
}

describe('planImages', () => {
  it('empareja ignorando mayúsculas, espacios y extensión', () => {
    const plan = planImages(['Producto Alfa.JPG'], [alfa, beta])
    expect(plan.matched).toEqual([
      { input: 'Producto Alfa.JPG', expected: alfa },
    ])
    expect(plan.missing).toEqual([beta])
  })

  it('separa las fotos que no corresponden a ningún producto', () => {
    const plan = planImages(['foto-rara.jpg'], [alfa])
    expect(plan.unmatched).toEqual(['foto-rara.jpg'])
    expect(plan.missing).toEqual([alfa])
  })

  it('detecta conflictos y no los procesa ni los marca como faltantes', () => {
    const conflict = planImages(
      ['producto-alfa.jpg', 'Producto Alfa.png'],
      [alfa],
    )
    expect(conflict.conflicts).toEqual([
      {
        name: 'producto-alfa',
        inputs: ['producto-alfa.jpg', 'Producto Alfa.png'],
      },
    ])
    expect(conflict.matched).toEqual([])
    expect(conflict.missing).toEqual([])
  })
})

describe('splitInputs', () => {
  it('ignora formatos no soportados (ej. HEIC)', () => {
    expect(splitInputs(['a.JPG', 'b.heic', 'c.png', 'notas.txt'])).toEqual({
      supported: ['a.JPG', 'c.png'],
      ignored: ['b.heic', 'notas.txt'],
    })
  })
})

describe('expectedImages / invalidCatalogPaths', () => {
  const products = [
    {
      name: 'Alfa',
      image: { path: 'products/alfa.webp', alt: '' },
      gallery: [{ path: 'products/alfa-2.webp', alt: '' }],
    },
    { name: 'Beta', image: { path: 'Products/Beta.jpg', alt: '' } },
  ]

  it('incluye imagen principal y galería', () => {
    expect(expectedImages(products).map((e) => e.name)).toEqual([
      'alfa',
      'alfa-2',
      'beta',
    ])
  })

  it('marca rutas fuera de convención', () => {
    const invalid = invalidCatalogPaths(expectedImages(products))
    expect(invalid.map((e) => e.path)).toEqual(['Products/Beta.jpg'])
  })
})
