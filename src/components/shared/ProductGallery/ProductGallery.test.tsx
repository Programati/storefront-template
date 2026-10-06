// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import type { ImageResolver } from '@/lib/images'
import { ProductGallery } from './ProductGallery'

afterEach(cleanup)

const resolver: ImageResolver = (path) => ({
  src: `https://img.test/${path}`,
  srcSet: '',
})

const images = [
  { path: 'products/torta.webp', alt: 'Torta de frente' },
  { path: 'products/torta-2.webp', alt: 'Torta de costado' },
  { path: 'products/torta-3.webp', alt: 'Detalle de la decoración' },
]

function renderGallery(list = images) {
  return render(
    <ProductGallery images={list} resolver={resolver} sizes="100vw" />,
  )
}

describe('ProductGallery', () => {
  it('con una sola foto no muestra miniaturas', () => {
    renderGallery(images.slice(0, 1))
    expect(screen.getByRole('img', { name: 'Torta de frente' })).toBeTruthy()
    expect(screen.queryAllByRole('button').length).toBe(0)
  })

  it('muestra una miniatura por foto y la primera como principal', () => {
    renderGallery()
    expect(screen.getAllByRole('button').length).toBe(3)
    expect(screen.getByRole('img', { name: 'Torta de frente' })).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Ver foto 1 de 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })

  it('al elegir una miniatura cambia la foto principal', async () => {
    renderGallery()
    await userEvent.click(
      screen.getByRole('button', { name: 'Ver foto 3 de 3' }),
    )
    expect(
      screen.getByRole('img', { name: 'Detalle de la decoración' }),
    ).toBeTruthy()
    expect(screen.queryByRole('img', { name: 'Torta de frente' })).toBeNull()
    expect(
      screen
        .getByRole('button', { name: 'Ver foto 3 de 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })
})
