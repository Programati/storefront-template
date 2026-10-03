// Excepción deliberada a "nadie importa store-pack": valida el catálogo real,
// igual que catalogQuality.test.ts y prepare-images.ts.
import { describe, expect, it } from 'vitest'
import { catalog } from '../../src/store-pack/catalog'
import { expectedImages, invalidCatalogPaths } from './plan'

describe('rutas de imagen del catálogo de store-pack', () => {
  const expected = expectedImages(catalog.products)

  it('el catálogo declara imágenes (si no, los demás chequeos serían vacíos)', () => {
    expect(expected.length).toBeGreaterThan(0)
  })

  it('todas las rutas siguen la convención', () => {
    // Si falla, se corrige el dato del catálogo, no el test.
    expect(invalidCatalogPaths(expected).map((e) => e.path)).toEqual([])
  })
})
