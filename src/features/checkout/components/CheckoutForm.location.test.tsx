// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DeliveryMethod } from '@/types'
import type { CheckoutFormValues } from '../types'
import { CheckoutForm } from './CheckoutForm'

afterEach(cleanup)

const methods: DeliveryMethod[] = [
  { id: 'pickup', label: 'Retiro en el local', requiresAddress: false },
  { id: 'delivery', label: 'Envío a domicilio', requiresAddress: true },
]

const base: CheckoutFormValues = {
  name: '',
  deliveryMethodId: 'delivery',
  address: '',
  date: '',
  time: '',
  notes: '',
}

function setup(
  values: Partial<CheckoutFormValues> = {},
  locationLink: boolean | undefined = true,
) {
  const onChange = vi.fn()
  render(
    <CheckoutForm
      values={{ ...base, ...values }}
      errors={{}}
      deliveryMethods={methods}
      scheduling="none"
      minDate="2026-10-06"
      locationLink={locationLink}
      onChange={onChange}
      onSubmit={() => null}
    />,
  )
  return { onChange, user: userEvent.setup() }
}

describe('CheckoutForm: ubicación por link', () => {
  it('con el interruptor apagado no muestra el campo', () => {
    setup({}, false)
    expect(screen.queryByLabelText(/Ubicación en Google Maps/)).toBeNull()
  })

  it('prendido y con entrega a domicilio muestra el campo', () => {
    setup()
    expect(screen.getByLabelText(/Ubicación en Google Maps/)).toBeTruthy()
  })

  it('con retiro no muestra el campo aunque esté prendido', () => {
    setup({ deliveryMethodId: 'pickup' })
    expect(screen.queryByLabelText(/Ubicación en Google Maps/)).toBeNull()
  })

  it('avisa el campo y el valor al escribir', async () => {
    const { user, onChange } = setup()
    await user.type(screen.getByLabelText(/Ubicación en Google Maps/), 'h')
    expect(onChange).toHaveBeenCalledWith('locationUrl', 'h')
  })

  it('con un link válido muestra la tarjeta con el botón', () => {
    setup({ locationUrl: 'https://maps.app.goo.gl/AbC123' })
    const link = screen.getByRole('link', { name: /Abrir en Google Maps/ })
    expect(link.getAttribute('href')).toBe('https://maps.app.goo.gl/AbC123')
  })

  it('con un link inválido no muestra la tarjeta', () => {
    setup({ locationUrl: 'javascript:alert(1)' })
    expect(screen.queryByRole('link')).toBeNull()
  })
})
