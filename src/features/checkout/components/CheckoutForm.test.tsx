// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DeliveryMethod } from '@/types'
import type {
  CheckoutErrors,
  CheckoutField,
  CheckoutFormValues,
} from '../types'
import { LIMITS } from '../validation'
import { CheckoutForm } from './CheckoutForm'

afterEach(cleanup)

const methods: DeliveryMethod[] = [
  {
    id: 'pickup',
    label: 'Retiro en el local',
    requiresAddress: false,
    note: 'Lunes a viernes',
  },
  { id: 'delivery', label: 'Envío a domicilio', requiresAddress: true },
]

const emptyValues: CheckoutFormValues = {
  name: '',
  deliveryMethodId: 'pickup',
  address: '',
  date: '',
  time: '',
  notes: '',
}

interface SetupOptions {
  values?: Partial<CheckoutFormValues>
  errors?: CheckoutErrors
  deliveryMethods?: DeliveryMethod[]
  scheduling?: 'none' | 'date' | 'datetime'
  submitResult?: CheckoutField | null
}

function setup({
  values = {},
  errors = {},
  deliveryMethods = methods,
  scheduling = 'none',
  submitResult = null,
}: SetupOptions = {}) {
  const onChange = vi.fn()
  const onSubmit = vi.fn<() => CheckoutField | null>(() => submitResult)
  render(
    <CheckoutForm
      values={{ ...emptyValues, ...values }}
      errors={errors}
      deliveryMethods={deliveryMethods}
      scheduling={scheduling}
      minDate="2026-10-03"
      onChange={onChange}
      onSubmit={onSubmit}
    />,
  )
  return { onChange, onSubmit, user: userEvent.setup() }
}

describe('CheckoutForm', () => {
  it('muestra los campos básicos y el botón de envío', () => {
    setup()
    expect(screen.getByLabelText('Tu nombre')).toBeTruthy()
    expect(screen.getByLabelText(/Notas/)).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Enviar pedido por WhatsApp' }),
    ).toBeTruthy()
  })

  it('avisa el campo y el valor cuando se escribe el nombre', async () => {
    const { user, onChange } = setup()
    await user.type(screen.getByLabelText('Tu nombre'), 'A')
    expect(onChange).toHaveBeenCalledWith('name', 'A')
  })

  it('usa LIMITS como maxLength de los textos', () => {
    setup()
    expect(screen.getByLabelText('Tu nombre').getAttribute('maxlength')).toBe(
      String(LIMITS.name),
    )
    expect(screen.getByLabelText(/Notas/).getAttribute('maxlength')).toBe(
      String(LIMITS.notes),
    )
  })

  it('muestra el error del campo y lo vincula al control', () => {
    setup({ errors: { name: 'Ingresá tu nombre.' } })
    const input = screen.getByLabelText('Tu nombre')
    expect(screen.getByRole('alert').textContent).toBe('Ingresá tu nombre.')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('checkout-name-error')
  })

  it('con un solo método de entrega no muestra el selector', () => {
    setup({ deliveryMethods: [methods[0]] })
    expect(screen.queryByText('¿Cómo lo recibís?')).toBeNull()
  })

  it('con varios métodos permite elegir y avisa el id', async () => {
    const { user, onChange } = setup()
    expect(screen.getByText('¿Cómo lo recibís?')).toBeTruthy()
    expect(screen.getByText('Lunes a viernes')).toBeTruthy()
    await user.click(screen.getByRole('radio', { name: /Envío a domicilio/ }))
    expect(onChange).toHaveBeenCalledWith('deliveryMethodId', 'delivery')
  })

  it('pide dirección solo si el método elegido la requiere', () => {
    setup({ values: { deliveryMethodId: 'pickup' } })
    expect(screen.queryByLabelText('Dirección de entrega')).toBeNull()
    cleanup()
    setup({ values: { deliveryMethodId: 'delivery' } })
    expect(screen.getByLabelText('Dirección de entrega')).toBeTruthy()
  })

  it('sin programación no muestra fecha ni horario', () => {
    setup({ scheduling: 'none' })
    expect(screen.queryByLabelText(/Fecha deseada/)).toBeNull()
    expect(screen.queryByLabelText(/Horario/)).toBeNull()
  })

  it('con programación "date" muestra solo la fecha', () => {
    setup({ scheduling: 'date' })
    expect(screen.getByLabelText(/Fecha deseada/)).toBeTruthy()
    expect(screen.queryByLabelText(/Horario/)).toBeNull()
  })

  it('con programación "datetime" muestra fecha y horario, con la fecha mínima', () => {
    setup({ scheduling: 'datetime' })
    expect(screen.getByLabelText(/Fecha deseada/).getAttribute('min')).toBe(
      '2026-10-03',
    )
    expect(screen.getByLabelText(/Horario/)).toBeTruthy()
  })

  it('al enviar sin errores llama a onSubmit y no mueve el foco al formulario', async () => {
    const { user, onSubmit } = setup({ submitResult: null })
    await user.click(
      screen.getByRole('button', { name: 'Enviar pedido por WhatsApp' }),
    )
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(document.activeElement).not.toBe(screen.getByLabelText('Tu nombre'))
  })

  it('al enviar con un campo inválido le da el foco', async () => {
    const { user } = setup({ submitResult: 'name' })
    await user.click(
      screen.getByRole('button', { name: 'Enviar pedido por WhatsApp' }),
    )
    expect(document.activeElement).toBe(screen.getByLabelText('Tu nombre'))
  })
})
