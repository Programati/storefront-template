// Excepción deliberada a "nadie importa store-pack": valida el contenido real,
// igual que catalogPaths.test.ts y prepare-banners.ts.
import { describe, expect, it } from 'vitest'
import { storeContent } from '../../src/store-pack/content'
import {
  bannersWithoutAlt,
  duplicatedNames,
  expectedBanners,
  heroBanners,
} from './banners'
import { invalidCatalogPaths } from './plan'

describe('banners del hero de store-pack', () => {
  const banners = heroBanners(storeContent)
  const expected = expectedBanners(banners)

  it('todas las rutas siguen la convención', () => {
    // Si falla, se corrige el dato del contenido, no el test.
    expect(invalidCatalogPaths(expected).map((e) => e.path)).toEqual([])
  })

  it('todos los banners tienen alt', () => {
    expect(bannersWithoutAlt(banners)).toEqual([])
  })

  it('no hay nombres de archivo repetidos', () => {
    expect(duplicatedNames(expected)).toEqual([])
  })
})
