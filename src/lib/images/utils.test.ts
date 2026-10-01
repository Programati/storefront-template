import { describe, expect, it } from 'vitest'
import { cleanPath, clampQuality, clampWidth, trimBase } from './utils'

describe('trimBase', () => {
  it('saca barras finales', () => {
    expect(trimBase('https://ik.imagekit.io/abc//')).toBe(
      'https://ik.imagekit.io/abc',
    )
  })
})

describe('cleanPath', () => {
  it('saca barras iniciales y repetidas', () => {
    expect(cleanPath('//products//a.webp')).toBe('products/a.webp')
  })
  it('codifica espacios y caracteres especiales por segmento', () => {
    expect(cleanPath('products/mi foto ñ.webp')).toBe(
      'products/mi%20foto%20%C3%B1.webp',
    )
  })
  it('descarta . y ..', () => {
    expect(cleanPath('../products/./a.webp')).toBe('products/a.webp')
  })
})

describe('clampWidth', () => {
  it('redondea y limita', () => {
    expect(clampWidth(320.6)).toBe(321)
    expect(clampWidth(0)).toBe(1)
    expect(clampWidth(99999)).toBe(3840)
    expect(clampWidth(NaN)).toBe(1)
  })
})

describe('clampQuality', () => {
  it('usa 80 por defecto y limita a 1..100', () => {
    expect(clampQuality()).toBe(80)
    expect(clampQuality(150)).toBe(100)
    expect(clampQuality(-5)).toBe(1)
    expect(clampQuality(NaN)).toBe(80)
  })
})
