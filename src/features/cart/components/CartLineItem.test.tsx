// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '@/app/StoreProvider'
import { formatCurrency } from '@/lib/format-currency'
import type { Catalog, StoreConfig } from '@/types'
import type { CartLineView } from '../cartView'
import { CartLineItem } from './CartLineItem'

afterEach(cleanup)

const config: StoreConfig = {
  storeName: 'Tienda de prueba',
  whatsappNumber: '5491100000000',
  currency: 'ARS',
  maxQtyPerLine: 10,
  deliveryMethods: [],
}

const catalog: Catalog = { categories: [], products: [], pricingRules: [] }

function makeView(overrides: Partial<CartLineView> = {}): CartLineView {
  return {
    lineId: 'l1',
    productId: 'p1',
    productName: 'Alfa',
    image: { path: 'products/alfa.webp', alt: 'Frasco de vidrio ámbar' },
    variantLabel: null,
    optionLabels: [],
    qty: 2,
    unitPrice: 4500,
    baseUnitPrice: 4500,
    lineTotal: 9000,
    lineSavings: 0,
    ...overrides,
  }
}

function setup(view: CartLineView, maxQty = 10) {
  const onQtyChange = vi.fn()
  const onRemove = vi.fn()
  const { container } = render(
    <StoreProvider config={config} catalog={catalog}>
      <ul>
        <CartLineItem
          view={view}
          currency="ARS"
          maxQty={maxQty}
          onQtyChange={onQtyChange}
          onRemove={onRemove}
        />
      </ul>
    </StoreProvider>,
  )
  return { container, onQtyChange, onRemove, user: userEvent.setup() }
}

describe('CartLineItem', () => {
  it('muestra el nombre y la imagen con su alt', () => {
    setup(makeView())
    expect(screen.getByText('Alfa')).toBeTruthy()
    expect(
      screen.getByRole('img', { name: 'Frasco de vidrio ámbar' }),
    ).toBeTruthy()
  })

  it('une variante y opciones elegidas en una sola línea', () => {
    setup(makeView({ variantLabel: 'Grande', optionLabels: ['Rojo', 'Caja'] }))
    expect(screen.getByText('Grande · Rojo · Caja')).toBeTruthy()
  })

  it('sin variante ni opciones no muestra línea de detalle', () => {
    const { container } = setup(makeView())
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })

  it('sin ahorro muestra un único precio', () => {
    const { container } = setup(makeView())
    const total = formatCurrency(9000, 'ARS')
    expect(container.textContent?.split(total)).toHaveLength(2)
  })

  it('con ahorro muestra el precio base y el total con descuento', () => {
    const { container } = setup(
      makeView({ unitPrice: 3750, lineTotal: 7500, lineSavings: 1500 }),
    )
    expect(container.textContent).toContain(formatCurrency(9000, 'ARS'))
    expect(container.textContent).toContain(formatCurrency(7500, 'ARS'))
  })

  it('quitar avisa con el lineId', async () => {
    const { user, onRemove } = setup(makeView())
    await user.click(screen.getByRole('button', { name: 'Quitar Alfa' }))
    expect(onRemove).toHaveBeenCalledWith('l1')
  })

  it('cambiar la cantidad avisa con lineId y nueva cantidad', async () => {
    const { user, onQtyChange } = setup(makeView())
    await user.click(screen.getByRole('button', { name: 'Sumar cantidad' }))
    expect(onQtyChange).toHaveBeenCalledWith('l1', 3)
  })

  it('respeta la cantidad máxima', () => {
    setup(makeView({ qty: 5 }), 5)
    expect(
      screen.getByRole('button', { name: 'Sumar cantidad' }),
    ).toHaveProperty('disabled', true)
  })
})
