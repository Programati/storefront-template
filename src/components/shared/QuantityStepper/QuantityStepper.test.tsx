// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuantityStepper } from './QuantityStepper'

afterEach(cleanup)

function setup(props: Partial<Parameters<typeof QuantityStepper>[0]> = {}) {
  const onChange = vi.fn()
  render(<QuantityStepper value={3} max={10} onChange={onChange} {...props} />)
  return {
    onChange,
    user: userEvent.setup(),
    minus: screen.getByRole('button', { name: 'Restar cantidad' }),
    plus: screen.getByRole('button', { name: 'Sumar cantidad' }),
    input: screen.getByRole('textbox', { name: 'Cantidad' }),
  }
}

describe('QuantityStepper', () => {
  it('suma y resta de a uno', async () => {
    const { user, onChange, minus, plus } = setup()
    await user.click(plus)
    expect(onChange).toHaveBeenLastCalledWith(4)
    await user.click(minus)
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('deshabilita restar en el mínimo y sumar en el máximo', () => {
    expect(setup({ value: 1 }).minus).toHaveProperty('disabled', true)
    cleanup()
    expect(setup({ value: 10 }).plus).toHaveProperty('disabled', true)
  })

  it('deshabilita todo con disabled', () => {
    const { minus, plus, input } = setup({ disabled: true })
    expect(minus).toHaveProperty('disabled', true)
    expect(plus).toHaveProperty('disabled', true)
    expect(input).toHaveProperty('disabled', true)
  })

  it('al tipear respeta el máximo', async () => {
    // El input es controlado y el padre no actualiza `value`: tipear "0"
    // sobre "5" produce "50", que se recorta al máximo.
    const { user, onChange, input } = setup({ value: 5 })
    await user.type(input, '0')
    expect(onChange).toHaveBeenLastCalledWith(10)
  })

  it('descarta las letras al tipear', async () => {
    const { user, onChange, input } = setup({ value: 1, max: 100 })
    await user.type(input, 'a')
    expect(onChange).toHaveBeenLastCalledWith(1)
  })
})
