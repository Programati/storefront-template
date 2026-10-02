import { describe, expect, it } from 'vitest'
import { buildPageMeta } from './buildPageMeta'

describe('buildPageMeta', () => {
  const store = { storeName: 'Tienda Demo', tagline: 'Todo para vos' }

  it('arma el título de la home con el tagline', () => {
    expect(buildPageMeta(store).title).toBe('Tienda Demo — Todo para vos')
  })

  it('usa solo el nombre si no hay tagline', () => {
    expect(buildPageMeta({ storeName: 'Tienda Demo' }).title).toBe(
      'Tienda Demo',
    )
  })

  it('pone el título de la página antes del nombre', () => {
    expect(buildPageMeta(store, { pageTitle: 'Catálogo' }).title).toBe(
      'Catálogo · Tienda Demo',
    )
  })

  it('ignora un pageTitle vacío o de solo espacios', () => {
    expect(buildPageMeta(store, { pageTitle: '   ' }).title).toBe(
      'Tienda Demo — Todo para vos',
    )
  })

  it('prioriza la descripción explícita', () => {
    expect(
      buildPageMeta(store, { description: 'Texto propio' }).description,
    ).toBe('Texto propio')
  })

  it('cae al tagline y luego a un texto genérico', () => {
    expect(buildPageMeta(store).description).toBe('Todo para vos')
    expect(buildPageMeta({ storeName: 'Tienda Demo' }).description).toBe(
      'Catálogo online de Tienda Demo. Armá tu pedido y envialo por WhatsApp.',
    )
  })

  it('noindex es false por defecto y true si se pide', () => {
    expect(buildPageMeta(store).noindex).toBe(false)
    expect(buildPageMeta(store, { noindex: true }).noindex).toBe(true)
  })
})
