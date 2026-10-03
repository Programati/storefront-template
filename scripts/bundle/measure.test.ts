import { describe, expect, it } from 'vitest'
import { checkBudget, formatKb, measureAsset, totalGzip } from './measure'

describe('measureAsset', () => {
  it('mide bytes crudos y gzip', () => {
    const asset = measureAsset('a.js', 'x'.repeat(10_000))
    expect(asset.raw).toBe(10_000)
    expect(asset.gzip).toBeGreaterThan(0)
    expect(asset.gzip).toBeLessThan(asset.raw)
  })
})

describe('totalGzip', () => {
  it('suma el gzip de todos los assets', () => {
    expect(
      totalGzip([
        { name: 'a.js', raw: 1, gzip: 10 },
        { name: 'b.js', raw: 2, gzip: 5 },
      ]),
    ).toBe(15)
  })
})

describe('checkBudget', () => {
  it('pasa si el total está por debajo del tope', () => {
    expect(checkBudget(90, 100)).toEqual({
      ok: true,
      total: 90,
      max: 100,
      headroom: 10,
    })
  })
  it('pasa si el total es exactamente el tope', () => {
    expect(checkBudget(100, 100).ok).toBe(true)
  })
  it('falla si lo supera y devuelve el margen negativo', () => {
    expect(checkBudget(110, 100)).toEqual({
      ok: false,
      total: 110,
      max: 100,
      headroom: -10,
    })
  })
})

describe('formatKb', () => {
  it('formatea bytes en kB con dos decimales', () => {
    expect(formatKb(166_910)).toBe('166.91 kB')
  })
})
