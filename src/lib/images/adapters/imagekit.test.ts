import { describe, expect, it } from 'vitest'
import { imagekitAdapter } from './imagekit'

const BASE = 'https://ik.imagekit.io/demo'

describe('imagekitAdapter', () => {
  it('arma la URL con ancho, calidad y formato automático', () => {
    expect(imagekitAdapter(BASE, 'products/alfa.webp', { width: 400 })).toBe(
      'https://ik.imagekit.io/demo/products/alfa.webp?tr=w-400,q-80,f-auto',
    )
  })

  it('respeta la calidad pedida', () => {
    expect(
      imagekitAdapter(BASE, 'products/alfa.webp', { width: 400, quality: 60 }),
    ).toContain('q-60')
  })

  it('tolera barras sobrantes en base y ruta', () => {
    expect(
      imagekitAdapter(`${BASE}/`, '/products/alfa.webp', { width: 320 }),
    ).toBe(
      'https://ik.imagekit.io/demo/products/alfa.webp?tr=w-320,q-80,f-auto',
    )
  })

  it('no permite salirse de la carpeta con ..', () => {
    expect(imagekitAdapter(BASE, '../secreto.webp', { width: 320 })).toBe(
      'https://ik.imagekit.io/demo/secreto.webp?tr=w-320,q-80,f-auto',
    )
  })
})
