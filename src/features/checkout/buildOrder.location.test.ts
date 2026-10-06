import { describe, expect, it } from 'vitest'
import type { DeliveryMethod } from '@/types'
import { buildOrder } from './buildOrder'
import { sampleOrder } from './orderFixture'
import type { CheckoutFormValues } from './types'

const deliveryMethods: DeliveryMethod[] = [
  { id: 'pickup', label: 'Retiro', requiresAddress: false },
  { id: 'delivery', label: 'Envío', requiresAddress: true },
]

const values: CheckoutFormValues = {
  name: 'Ana',
  deliveryMethodId: 'delivery',
  address: 'Calle 123',
  date: '',
  time: '',
  notes: '',
  locationUrl: ' https://maps.app.goo.gl/AbC123 ',
}

function build(overrides: Partial<CheckoutFormValues> = {}) {
  return buildOrder({
    values: { ...values, ...overrides },
    views: [],
    totals: sampleOrder.totals,
    deliveryMethods,
    storeName: 'Tienda',
    now: new Date('2026-10-06T12:00:00Z'),
    code: 'TD-0001',
  })
}

describe('buildOrder: link de ubicación', () => {
  it('guarda el link normalizado cuando la entrega requiere dirección', () => {
    expect(build().customer.locationUrl).toBe('https://maps.app.goo.gl/AbC123')
  })

  it('con retiro no viaja aunque haya un valor viejo', () => {
    expect(build({ deliveryMethodId: 'pickup' }).customer.locationUrl).toBe(
      undefined,
    )
  })

  it('un link inválido no viaja', () => {
    expect(
      build({ locationUrl: 'javascript:alert(1)' }).customer.locationUrl,
    ).toBe(undefined)
  })

  it('sin link, el campo no existe', () => {
    expect('locationUrl' in build({ locationUrl: '' }).customer).toBe(false)
  })
})
