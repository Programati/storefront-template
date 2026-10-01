import { describe, expect, it } from 'vitest'
import { isOrder } from './isOrder'
import { sampleOrder } from './orderFixture'

describe('isOrder', () => {
  it('acepta un pedido bien formado', () => {
    expect(isOrder(sampleOrder)).toBe(true)
  })

  it('rechaza valores que no son un pedido', () => {
    expect(isOrder(null)).toBe(false)
    expect(isOrder('pedido')).toBe(false)
    expect(isOrder({ ...sampleOrder, totals: null })).toBe(false)
    expect(isOrder({ ...sampleOrder, lines: [{ productName: 'x' }] })).toBe(
      false,
    )
  })
})
