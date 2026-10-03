// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatCurrency } from '@/lib/format-currency'
import type { ImageResolver } from '@/lib/images'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

afterEach(cleanup)

const resolveImage: ImageResolver = (path) => ({
  src: `/img/${path}`,
  srcSet: '',
})

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    slug: 'alfa',
    name: 'Alfa',
    description: 'Un producto de prueba',
    categoryId: 'cat-a',
    image: { path: 'products/alfa.webp', alt: 'Frasco de vidrio ámbar' },
    variants: [{ id: 'v1', label: 'Único', price: 4500 }],
    optionGroups: [],
    ...overrides,
  }
}

function setup(product: Product, maxQty = 10) {
  const onAdd = vi.fn()
  const onOpenOptions = vi.fn()
  const view = render(
    <ProductCard
      product={product}
      currency="ARS"
      maxQty={maxQty}
      resolveImage={resolveImage}
      imageSizes="100vw"
      onAdd={onAdd}
      onOpenOptions={onOpenOptions}
    />,
  )
  return { ...view, onAdd, onOpenOptions, user: userEvent.setup() }
}

describe('ProductCard', () => {
  it('muestra nombre, descripción e imagen con su alt', () => {
    setup(makeProduct())
    expect(screen.getByRole('heading', { name: 'Alfa' })).toBeTruthy()
    expect(screen.getByText('Un producto de prueba')).toBeTruthy()
    expect(
      screen.getByRole('img', { name: 'Frasco de vidrio ámbar' }),
    ).toBeTruthy()
  })

  it('producto simple: muestra el precio sin "Desde"', () => {
    const { container } = setup(makeProduct())
    expect(container.textContent).toContain(formatCurrency(4500, 'ARS'))
    expect(container.textContent).not.toContain('Desde')
  })

  it('producto simple: agrega la variante con la cantidad elegida', async () => {
    const product = makeProduct()
    const { user, onAdd } = setup(product)
    await user.click(screen.getByRole('button', { name: 'Sumar cantidad' }))
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(product, 'v1', 2)
  })

  it('respeta la cantidad máxima del stepper', async () => {
    const { user } = setup(makeProduct(), 2)
    const plus = screen.getByRole('button', { name: 'Sumar cantidad' })
    await user.click(plus)
    expect(plus).toHaveProperty('disabled', true)
  })

  it('varias variantes: "Desde" el precio más bajo y pide elegir opciones', async () => {
    const product = makeProduct({
      variants: [
        { id: 'grande', label: 'Grande', price: 8000 },
        { id: 'chico', label: 'Chico', price: 4500 },
      ],
    })
    const { user, container, onOpenOptions } = setup(product)
    expect(container.textContent).toContain(
      `Desde ${formatCurrency(4500, 'ARS')}`,
    )
    expect(container.textContent).not.toContain(formatCurrency(8000, 'ARS'))
    expect(screen.queryByRole('button', { name: 'Agregar' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Elegir opciones' }))
    expect(onOpenOptions).toHaveBeenCalledWith(product)
  })

  it('con grupos de opciones y una sola variante también pide elegir', () => {
    setup(
      makeProduct({
        optionGroups: [
          {
            id: 'extra',
            label: 'Extra',
            type: 'multiple',
            required: false,
            choices: [{ id: 'e1', label: 'Caja de regalo' }],
          },
        ],
      }),
    )
    expect(screen.getByRole('button', { name: 'Elegir opciones' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Agregar' })).toBeNull()
  })

  it('agotado: botón deshabilitado, cartel y sin acciones de compra', () => {
    setup(makeProduct({ soldOut: true }))
    expect(screen.getByRole('button', { name: 'Agotado' })).toHaveProperty(
      'disabled',
      true,
    )
    expect(screen.getByText('AGOTADO')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Agregar' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Elegir opciones' })).toBeNull()
  })

  it('muestra solo los dos primeros detalles', () => {
    setup(
      makeProduct({
        details: { a: '250 ml', b: 'Vainilla', c: 'Hecho a mano' },
      }),
    )
    expect(screen.getByText('250 ml')).toBeTruthy()
    expect(screen.getByText('Vainilla')).toBeTruthy()
    expect(screen.queryByText('Hecho a mano')).toBeNull()
  })
})
