import { describe, expect, it } from 'vitest'
import type { DeliveryMethod } from '@/types'
import { buildOrder } from './buildOrder'
import type { CheckoutFormValues } from './types'

const deliveryMethods: DeliveryMethod[] = [
  { id: 'pickup', label: 'Retiro', requiresAddress: false },
  { id: 'delivery', label: 'Envío', requiresAddress: true },
]
const totals = { subtotal: 0, discount: 0, total: 0 }
const base: CheckoutFormValues = {
  name: '*Ana*',
  deliveryMethodId: 'delivery',
  address: 'Calle 123',
  date: '2026-10-05',
  time: '16:00',
  notes: 'sin\nnueces',
}
const build = (values: CheckoutFormValues) =>
  buildOrder({
    values,
    views: [],
    totals,
    deliveryMethods,
    storeName: 'Tienda Demo',
    code: 'TD-AAAA',
  })

describe('buildOrder', () => {
  it('sanea los textos y arma el pedido', () => {
    const order = build(base)
    expect(order.customer).toEqual({
      name: 'Ana',
      deliveryLabel: 'Envío',
      address: 'Calle 123',
      notes: ['sin', 'nueces'],
    })
    expect(order.schedule).toEqual({ date: '2026-10-05', time: '16:00' })
    expect(order.code).toBe('TD-AAAA')
  })

  it('no guarda la dirección si el método no la requiere', () => {
    expect(
      build({ ...base, deliveryMethodId: 'pickup' }).customer.address,
    ).toBeUndefined()
  })

  it('ignora el horario si no hay fecha', () => {
    expect(build({ ...base, date: '' }).schedule).toEqual({})
  })
})
