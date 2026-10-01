import { describe, expect, it } from 'vitest'
import { makeOrderCode, orderPrefix } from './orderCode'

describe('orderPrefix', () => {
  it('usa las iniciales del nombre', () => {
    expect(orderPrefix('Dulce Olivia')).toBe('DO')
  })

  it('ignora tildes y símbolos', () => {
    expect(orderPrefix('Ámbar & Co')).toBe('AC')
  })

  it('cae a PED si no hay letras', () => {
    expect(orderPrefix('123')).toBe('PED')
  })
})

describe('makeOrderCode', () => {
  it('arma prefijo + 4 caracteres', () => {
    expect(makeOrderCode('Dulce Olivia', () => 0)).toBe('DO-AAAA')
  })

  it('el alfabeto no incluye caracteres ambiguos', () => {
    const suffixes = Array.from({ length: 32 }, (_, i) =>
      makeOrderCode('X', () => i).slice(2),
    ).join('')
    expect(suffixes).not.toMatch(/[IO01]/)
  })
})
