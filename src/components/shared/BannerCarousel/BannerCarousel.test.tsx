// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImageResolver } from '@/lib/images'
import { BannerCarousel } from './BannerCarousel'

const resolver: ImageResolver = (path) => ({
  src: `https://img.test/${path}`,
  srcSet: '',
})

const images = [
  { path: 'banners/a.webp', alt: 'Mesa de dulces' },
  { path: 'banners/b.webp', alt: 'Torta recién hecha' },
  { path: 'banners/c.webp', alt: 'Caja de regalo abierta' },
]

function renderCarousel(list = images) {
  return render(
    <BannerCarousel
      images={list}
      resolver={resolver}
      sizes="100vw"
      label="Fotos destacadas"
    >
      <p>Contenido encima</p>
    </BannerCarousel>,
  )
}

describe('BannerCarousel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  it('muestra la primera foto, el contenido y un punto por foto', () => {
    renderCarousel()
    expect(screen.getByRole('img', { name: 'Mesa de dulces' })).toBeTruthy()
    expect(screen.getByText('Contenido encima')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /^Ver imagen/ }).length).toBe(
      3,
    )
  })

  it('con una sola foto no muestra controles', () => {
    renderCarousel(images.slice(0, 1))
    expect(screen.queryAllByRole('button').length).toBe(0)
  })

  it('pasa a la siguiente foto cuando se cumple el intervalo', () => {
    renderCarousel()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByRole('img', { name: 'Torta recién hecha' })).toBeTruthy()
    expect(screen.queryByRole('img', { name: 'Mesa de dulces' })).toBeNull()
  })

  it('vuelve a la primera después de la última', () => {
    renderCarousel()
    for (let i = 0; i < images.length; i++) {
      act(() => {
        vi.advanceTimersByTime(5000)
      })
    }
    expect(screen.getByRole('img', { name: 'Mesa de dulces' })).toBeTruthy()
  })

  it('un punto lleva a esa foto', () => {
    renderCarousel()
    fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 3 de 3' }))
    expect(
      screen.getByRole('img', { name: 'Caja de regalo abierta' }),
    ).toBeTruthy()
  })

  it('la primera foto no hace fundido; las siguientes sí', () => {
    renderCarousel()
    const first = screen.getByRole('img', { name: 'Mesa de dulces' })
    expect(first.className.includes('animate-in')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Foto siguiente' }))
    const second = screen.getByRole('img', { name: 'Torta recién hecha' })
    expect(second.className.includes('animate-in')).toBe(true)
  })

  it('las flechas avanzan y retroceden sin fin', () => {
    renderCarousel()
    fireEvent.click(screen.getByRole('button', { name: 'Foto siguiente' }))
    expect(screen.getByRole('img', { name: 'Torta recién hecha' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }))
    expect(
      screen.getByRole('img', { name: 'Caja de regalo abierta' }),
    ).toBeTruthy()
  })

  it('sigue rotando solo después de usar una flecha', () => {
    renderCarousel()
    fireEvent.click(screen.getByRole('button', { name: 'Foto siguiente' }))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(
      screen.getByRole('img', { name: 'Caja de regalo abierta' }),
    ).toBeTruthy()
  })

  it('con "reducir movimiento" no rota solo pero se navega a mano', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => ({ matches: true }),
    })
    renderCarousel()
    act(() => {
      vi.advanceTimersByTime(20000)
    })
    expect(screen.getByRole('img', { name: 'Mesa de dulces' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Foto siguiente' }))
    expect(screen.getByRole('img', { name: 'Torta recién hecha' })).toBeTruthy()
  })
})
