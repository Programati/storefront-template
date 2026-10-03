// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { formatCurrency } from '@/lib/format-currency'
import { PriceTag } from './PriceTag'

afterEach(cleanup)

describe('PriceTag', () => {
  it('muestra el monto formateado', () => {
    const { container } = render(<PriceTag amount={4500} currency="ARS" />)
    expect(container.textContent).toBe(formatCurrency(4500, 'ARS'))
  })

  it('antepone "Desde" con fromLabel', () => {
    const { container } = render(
      <PriceTag amount={4500} currency="ARS" fromLabel />,
    )
    expect(container.textContent).toBe(`Desde ${formatCurrency(4500, 'ARS')}`)
  })

  it('aplica la clase recibida', () => {
    const { container } = render(
      <PriceTag amount={4500} currency="ARS" className="precio" />,
    )
    expect(container.firstElementChild?.classList.contains('precio')).toBe(true)
  })
})
