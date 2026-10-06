import { describe, expect, it } from 'vitest'
import type { DeliveryMethod } from '@/types'
import type { CheckoutFormValues } from './types'
import { validateCheckout } from './validation'

const methods: DeliveryMethod[] = [
  { id: 'pickup', label: 'Retiro', requiresAddress: false },
  { id: 'delivery', label: 'Envío', requiresAddress: true },
]

const base: CheckoutFormValues = {
  name: 'Ana',
  deliveryMethodId: 'delivery',
  address: 'Calle 123',
  date: '',
  time: '',
  notes: '',
}
const today = '2026-10-06'

describe('validateCheckout: link de ubicación', () => {
  it('sin link no hay error (es opcional)', () => {
    expect(validateCheckout(base, methods, today).locationUrl).toBeUndefined()
  })

  it('acepta un link de Google Maps', () => {
    const values = { ...base, locationUrl: 'https://maps.app.goo.gl/AbC123' }
    expect(validateCheckout(values, methods, today).locationUrl).toBeUndefined()
  })

  it('rechaza un link que no es de Google Maps', () => {
    const values = { ...base, locationUrl: 'javascript:alert(1)' }
    expect(validateCheckout(values, methods, today).locationUrl).toBeTruthy()
  })

  it('con retiro (sin dirección) ignora el link', () => {
    const values = {
      ...base,
      deliveryMethodId: 'pickup',
      locationUrl: 'no es un link',
    }
    expect(validateCheckout(values, methods, today).locationUrl).toBeUndefined()
  })
})
