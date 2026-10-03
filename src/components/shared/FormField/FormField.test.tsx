// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FormField } from './FormField'

afterEach(cleanup)

function setup(props: { error?: string; optional?: boolean } = {}) {
  render(
    <FormField id="nombre" label="Nombre" {...props}>
      {(control) => <input {...control} />}
    </FormField>,
  )
  return screen.getByLabelText(/Nombre/)
}

describe('FormField', () => {
  it('asocia la etiqueta con el control', () => {
    const input = setup()
    expect(input.id).toBe('nombre')
  })

  it('sin error no marca el control ni muestra alerta', () => {
    const input = setup()
    expect(input.hasAttribute('aria-invalid')).toBe(false)
    expect(input.hasAttribute('aria-describedby')).toBe(false)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('con error marca el control y lo vincula al mensaje', () => {
    const input = setup({ error: 'Falta el nombre' })
    const alert = screen.getByRole('alert')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('nombre-error')
    expect(alert.id).toBe('nombre-error')
    expect(alert.textContent).toBe('Falta el nombre')
  })

  it('indica "(opcional)" solo cuando corresponde', () => {
    setup({ optional: true })
    expect(screen.getByText(/opcional/)).toBeTruthy()
    cleanup()
    setup()
    expect(screen.queryByText(/opcional/)).toBeNull()
  })
})
