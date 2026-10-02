import { describe, expect, it } from 'vitest'
import { fileBaseName, isCanonicalPath, normalizeName } from './naming'

describe('normalizeName', () => {
  it('saca extensión, acentos, mayúsculas y espacios', () => {
    expect(normalizeName('Producto Álfa (1).JPG')).toBe('producto-alfa-1')
  })
  it('colapsa separadores raros y recorta guiones', () => {
    expect(normalizeName('__foto  nueva--2__.png')).toBe('foto-nueva-2')
  })
})

describe('fileBaseName', () => {
  it('devuelve el nombre sin carpeta ni extensión', () => {
    expect(fileBaseName('products/producto-alfa.webp')).toBe('producto-alfa')
  })
})

describe('isCanonicalPath', () => {
  it('acepta rutas bien formadas', () => {
    expect(isCanonicalPath('products/producto-alfa-2.webp')).toBe(true)
  })
  it.each([
    'Products/alfa.webp',
    'products/alfa.jpg',
    'products/mi foto.webp',
    '/products/alfa.webp',
  ])('rechaza %s', (path) => {
    expect(isCanonicalPath(path)).toBe(false)
  })
})
