import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrastRatio'

describe('contrastRatio', () => {
  it('negro sobre blanco es 21:1 (hex y oklch)', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 1)
    expect(contrastRatio('oklch(0 0 0)', 'oklch(1 0 0)')).toBeCloseTo(21, 1)
  })
  it('un color contra sí mismo es 1:1', () => {
    expect(contrastRatio('oklch(0.5 0 0)', 'oklch(0.5 0 0)')).toBeCloseTo(1, 5)
  })
  it('rechaza colores inválidos y con transparencia', () => {
    expect(() => contrastRatio('nope', '#fff')).toThrow(/no reconocido/)
    expect(() => contrastRatio('oklch(1 0 0 / 10%)', '#000')).toThrow(
      /transparencia/,
    )
  })
})
