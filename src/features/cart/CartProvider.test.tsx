// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '@/app/StoreProvider'
import type { Catalog, StoreConfig } from '@/types'
import { useCart } from './CartContext'
import { CartProvider } from './CartProvider'
import { CART_STORAGE_KEY } from './storage'

beforeEach(() => window.localStorage.clear())
afterEach(cleanup)

const config: StoreConfig = {
  storeName: 'Tienda de prueba',
  whatsappNumber: '5491100000000',
  currency: 'ARS',
  maxQtyPerLine: 10,
  deliveryMethods: [],
}

const catalog: Catalog = {
  categories: [{ id: 'cat-a', slug: 'cat-a', name: 'Categoría A' }],
  products: [
    {
      id: 'p1',
      slug: 'alfa',
      name: 'Alfa',
      description: 'Producto de prueba',
      categoryId: 'cat-a',
      image: { path: 'products/alfa.webp', alt: 'Frasco de vidrio ámbar' },
      variants: [{ id: 'v1', label: 'Único', price: 4500 }],
      optionGroups: [],
    },
  ],
  pricingRules: [],
}

function Probe() {
  const cart = useCart()
  const first = cart.lines[0]
  return (
    <div>
      <p data-testid="units">{cart.unitCount}</p>
      <p data-testid="lines">{cart.lines.length}</p>
      <p data-testid="empty">{String(cart.isEmpty)}</p>
      <p data-testid="qty">{first?.qty ?? 'sin línea'}</p>
      <p data-testid="total">{cart.pricedLines[0]?.lineTotal ?? 'sin total'}</p>
      <button
        onClick={() => cart.addLine({ productId: 'p1', variantId: 'v1' })}
      >
        Agregar uno
      </button>
      <button
        onClick={() =>
          cart.addLine({ productId: 'p1', variantId: 'v1', qty: 7 })
        }
      >
        Agregar siete
      </button>
      <button onClick={() => first && cart.setQty(first.lineId, 99)}>
        Pedir 99
      </button>
      <button onClick={() => first && cart.removeLine(first.lineId)}>
        Quitar
      </button>
      <button onClick={() => cart.clear()}>Vaciar</button>
    </div>
  )
}

function setup() {
  render(
    <StoreProvider config={config} catalog={catalog}>
      <CartProvider>
        <Probe />
      </CartProvider>
    </StoreProvider>,
  )
  return userEvent.setup()
}

const text = (id: string) => screen.getByTestId(id).textContent

function saveInStorage(lines: unknown[]) {
  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({ version: 1, lines }),
  )
}

describe('CartProvider', () => {
  it('arranca vacío si no hay nada guardado', () => {
    setup()
    expect(text('empty')).toBe('true')
    expect(text('units')).toBe('0')
  })

  it('hidrata el carrito desde localStorage al montar', () => {
    saveInStorage([
      { lineId: 'l1', productId: 'p1', variantId: 'v1', selected: {}, qty: 3 },
    ])
    setup()
    expect(text('units')).toBe('3')
    expect(text('total')).toBe('13500')
  })

  it('descarta lo guardado de un producto que ya no existe en el catálogo', () => {
    saveInStorage([
      { lineId: 'l1', productId: 'p1', variantId: 'v1', selected: {}, qty: 1 },
      {
        lineId: 'l2',
        productId: 'borrado',
        variantId: 'x',
        selected: {},
        qty: 2,
      },
    ])
    setup()
    expect(text('lines')).toBe('1')
    expect(text('units')).toBe('1')
  })

  it('agregar la misma variante dos veces suma en una sola línea', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    expect(text('lines')).toBe('1')
    expect(text('units')).toBe('2')
    expect(text('total')).toBe('9000')
  })

  it('respeta maxQtyPerLine de la config al agregar', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Agregar siete' }))
    await user.click(screen.getByRole('button', { name: 'Agregar siete' }))
    expect(text('qty')).toBe('10')
  })

  it('respeta maxQtyPerLine de la config al cambiar la cantidad', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    await user.click(screen.getByRole('button', { name: 'Pedir 99' }))
    expect(text('qty')).toBe('10')
  })

  it('quitar y vaciar dejan el carrito vacío', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    await user.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(text('empty')).toBe('true')

    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    await user.click(screen.getByRole('button', { name: 'Vaciar' }))
    expect(text('empty')).toBe('true')
  })

  it('persiste los cambios en localStorage', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    await user.click(screen.getByRole('button', { name: 'Agregar uno' }))
    const stored = JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) ?? 'null',
    )
    expect(stored).toMatchObject({
      version: 1,
      lines: [{ productId: 'p1', variantId: 'v1', qty: 2 }],
    })
  })

  it('useCart fuera del provider lanza un error claro', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(
      'useCart debe usarse dentro de <CartProvider>',
    )
    spy.mockRestore()
  })
})
