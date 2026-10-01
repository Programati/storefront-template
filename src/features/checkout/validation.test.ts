import { describe, expect, it } from 'vitest'
import type { DeliveryMethod } from '@/types'
import type { CheckoutFormValues } from './types'
import { todayLocalISO, validateCheckout } from './validation'

const methods: DeliveryMethod[] = [
  { id: 'pickup', label: 'Retiro', requiresAddress: false },
  { id: 'delivery', label: 'Envío', requiresAddress: true },
]
const valid: CheckoutFormValues = {
  name: 'Ana',
  deliveryMethodId: 'pickup',
  address: '',
  date: '',
  time: '',
  notes: '',
}
const TODAY = '2026-10-03'
const check = (overrides: Partial<CheckoutFormValues>) =>
  validateCheckout({ ...valid, ...overrides }, methods, TODAY)

describe('validateCheckout', () => {
  it('acepta un pedido mínimo válido', () => {
    expect(check({})).toEqual({})
  })

  it('exige un nombre real', () => {
    expect(check({ name: ' ' }).name).toBeDefined()
    expect(check({ name: '**' }).name).toBeDefined()
  })

  it('exige dirección solo si el método la requiere', () => {
    expect(check({ deliveryMethodId: 'delivery' }).address).toBeDefined()
    expect(
      check({ deliveryMethodId: 'delivery', address: 'Calle 123' }),
    ).toEqual({})
  })

  it('rechaza un método de entrega inexistente', () => {
    expect(check({ deliveryMethodId: 'drone' }).deliveryMethodId).toBeDefined()
  })

  it('rechaza fechas pasadas y acepta hoy', () => {
    expect(check({ date: '2026-10-02' }).date).toBeDefined()
    expect(check({ date: TODAY })).toEqual({})
  })

  it('no admite horario sin fecha', () => {
    expect(check({ time: '16:00' }).time).toBeDefined()
    expect(check({ date: TODAY, time: '16:00' })).toEqual({})
  })
})

describe('todayLocalISO', () => {
  it('usa la fecha local, no la UTC', () => {
    expect(todayLocalISO(new Date(2026, 9, 3, 23, 30))).toBe('2026-10-03')
  })
})
