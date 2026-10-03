// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { createMemoryRouter, useLocation } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '@/app/StoreProvider'
import { CartProvider } from '@/features/cart/CartProvider'
import { CART_STORAGE_KEY } from '@/features/cart/storage'
import { copyToClipboard } from '@/lib/clipboard'
import type { Catalog, StoreConfig } from '@/types'
import type { Order } from './types'
import { useCheckoutForm } from './useCheckoutForm'

vi.mock('@/lib/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}))

const config: StoreConfig = {
  storeName: 'Tienda de prueba',
  whatsappNumber: '5491100000000',
  currency: 'ARS',
  maxQtyPerLine: 10,
  deliveryMethods: [
    { id: 'pickup', label: 'Retiro en el local', requiresAddress: false },
  ],
}

function makeCatalog(productName = 'Alfa'): Catalog {
  return {
    categories: [{ id: 'cat-a', slug: 'cat-a', name: 'Categoría A' }],
    products: [
      {
        id: 'p1',
        slug: 'alfa',
        name: productName,
        description: 'Producto de prueba',
        categoryId: 'cat-a',
        image: { path: 'products/alfa.webp', alt: 'Frasco de vidrio ámbar' },
        variants: [{ id: 'v1', label: 'Único', price: 4500 }],
        optionGroups: [],
      },
    ],
    pricingRules: [],
  }
}

let openSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      lines: [
        {
          lineId: 'l1',
          productId: 'p1',
          variantId: 'v1',
          selected: {},
          qty: 1,
        },
      ],
    }),
  )
  vi.mocked(copyToClipboard).mockClear()
  openSpy = vi.spyOn(window, 'open').mockReturnValue(null)
})

afterEach(() => {
  cleanup()
  openSpy.mockRestore()
})

function Pedido() {
  const form = useCheckoutForm()
  const [result, setResult] = useState('sin enviar')
  return (
    <div>
      <p data-testid="name-error">{form.errors.name ?? ''}</p>
      <p data-testid="sent">{String(form.sent)}</p>
      <p data-testid="result">{result}</p>
      <button onClick={() => form.setField('name', 'Ana')}>
        Escribir nombre
      </button>
      <button onClick={() => setResult(String(form.submit()))}>Enviar</button>
    </div>
  )
}

function Gracias() {
  const { state } = useLocation() as { state: { order: Order } }
  return (
    <div>
      <p data-testid="gracias-name">{state.order.customer.name}</p>
      <p data-testid="gracias-code">{state.order.code}</p>
      <p data-testid="gracias-lines">{state.order.lines.length}</p>
    </div>
  )
}

function setup(productName?: string) {
  const router = createMemoryRouter(
    [
      { path: '/pedido', element: <Pedido /> },
      { path: '/gracias', element: <Gracias /> },
    ],
    { initialEntries: ['/pedido'] },
  )
  render(
    <StoreProvider config={config} catalog={makeCatalog(productName)}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </StoreProvider>,
  )
  return { user: userEvent.setup(), router }
}

const storedLines = () =>
  JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? 'null').lines

describe('useCheckoutForm', () => {
  it('no muestra errores antes del primer intento de envío', () => {
    setup()
    expect(screen.getByTestId('name-error').textContent).toBe('')
  })

  it('con datos inválidos devuelve el primer campo, muestra el error y no envía nada', async () => {
    const { user, router } = setup()
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByTestId('result').textContent).toBe('name')
    expect(screen.getByTestId('name-error').textContent).toBe(
      'Ingresá tu nombre.',
    )
    expect(openSpy).not.toHaveBeenCalled()
    expect(storedLines()).toHaveLength(1)
    expect(router.state.location.pathname).toBe('/pedido')
  })

  it('con datos válidos abre WhatsApp, vacía el carrito y va a /gracias con el pedido', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Escribir nombre' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    const [url, target, features] = openSpy.mock.calls[0]
    expect(String(url)).toContain(config.whatsappNumber)
    expect(target).toBe('_blank')
    expect(features).toBe('noopener,noreferrer')

    expect((await screen.findByTestId('gracias-name')).textContent).toBe('Ana')
    expect(screen.getByTestId('gracias-code').textContent).not.toBe('')
    expect(screen.getByTestId('gracias-lines').textContent).toBe('1')
    expect(storedLines()).toHaveLength(0)
  })

  it('con un mensaje que entra en el enlace no copia nada al portapapeles', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Escribir nombre' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    await screen.findByTestId('gracias-name')
    expect(copyToClipboard).not.toHaveBeenCalled()
  })

  it('con un mensaje demasiado largo lo copia al portapapeles antes de abrir WhatsApp', async () => {
    const { user } = setup('A'.repeat(2500))
    await user.click(screen.getByRole('button', { name: 'Escribir nombre' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    await screen.findByTestId('gracias-name')

    expect(copyToClipboard).toHaveBeenCalledTimes(1)
    const copiedAt = vi.mocked(copyToClipboard).mock.invocationCallOrder[0]
    const openedAt = openSpy.mock.invocationCallOrder[0]
    expect(copiedAt).toBeLessThan(openedAt)
  })
})
