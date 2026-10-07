// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SiteFooter } from './SiteFooter'

afterEach(cleanup)

describe('SiteFooter', () => {
  it('muestra la marca y la frase', () => {
    render(
      <SiteFooter brand={<span>Mi Tienda</span>} tagline="Hecho en casa" />,
    )
    expect(screen.getByText('Mi Tienda')).toBeTruthy()
    expect(screen.getByText('Hecho en casa')).toBeTruthy()
  })

  it('sin WhatsApp ni redes no muestra la sección de contacto', () => {
    render(<SiteFooter brand="Mi Tienda" />)
    expect(screen.queryByText('Contacto')).toBeNull()
  })

  it('muestra el WhatsApp con su link seguro y el botón Copiar', () => {
    const onCopy = vi.fn()
    render(
      <SiteFooter
        brand="Mi Tienda"
        whatsapp={{
          href: 'https://wa.me/5493794572993',
          display: '+54 9 3794 57-2993',
          onCopy,
        }}
      />,
    )
    const link = screen.getByRole('link', {
      name: /WhatsApp: \+54 9 3794 57-2993/,
    })
    expect(link.getAttribute('href')).toBe('https://wa.me/5493794572993')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    fireEvent.click(
      screen.getByRole('button', { name: 'Copiar número de WhatsApp' }),
    )
    expect(onCopy).toHaveBeenCalledTimes(1)
  })

  it('muestra las redes como enlaces seguros', () => {
    render(
      <SiteFooter
        brand="Mi Tienda"
        socials={[
          {
            name: 'instagram',
            label: 'Instagram',
            href: 'https://instagram.com/tienda',
          },
          {
            name: 'facebook',
            label: 'Facebook',
            href: 'https://facebook.com/tienda',
          },
        ]}
      />,
    )
    const instagram = screen.getByRole('link', { name: /Instagram/ })
    expect(instagram.getAttribute('href')).toBe('https://instagram.com/tienda')
    expect(instagram.getAttribute('target')).toBe('_blank')
    expect(screen.getByRole('link', { name: /Facebook/ })).toBeTruthy()
  })

  it('muestra las columnas informativas', () => {
    render(
      <SiteFooter
        brand="Mi Tienda"
        columns={[{ title: 'Retiro', lines: ['Calle 123', 'Envíos en moto'] }]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Retiro' })).toBeTruthy()
    expect(screen.getByText('Envíos en moto')).toBeTruthy()
  })
})
