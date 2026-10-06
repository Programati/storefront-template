import { describe, expect, it } from 'vitest'
import { isOrder } from './isOrder'
import { sampleOrder } from './orderFixture'

const withLocation = (locationUrl: unknown) => ({
  ...sampleOrder,
  customer: { ...sampleOrder.customer, locationUrl },
})

describe('isOrder: link de ubicación', () => {
  it('acepta un pedido sin link', () => {
    expect(isOrder(sampleOrder)).toBe(true)
  })

  it('acepta un link de Maps válido', () => {
    expect(isOrder(withLocation('https://maps.app.goo.gl/AbC123'))).toBe(true)
  })

  it('rechaza un link que no es de Maps', () => {
    expect(isOrder(withLocation('javascript:alert(1)'))).toBe(false)
  })

  it('rechaza un link que no es texto', () => {
    expect(isOrder(withLocation(42))).toBe(false)
  })
})
