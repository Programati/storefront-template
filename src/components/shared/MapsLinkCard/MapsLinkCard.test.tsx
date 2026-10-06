// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MapsLinkCard } from './MapsLinkCard'

afterEach(cleanup)

describe('MapsLinkCard', () => {
  it('muestra el destino y un link seguro a una pestaña nueva', () => {
    render(<MapsLinkCard url="https://maps.app.goo.gl/AbC123" />)
    expect(screen.getByText('maps.app.goo.gl')).toBeTruthy()
    const link = screen.getByRole('link', { name: /Abrir en Google Maps/ })
    expect(link.getAttribute('href')).toBe('https://maps.app.goo.gl/AbC123')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('no renderiza nada si la URL no es https', () => {
    render(<MapsLinkCard url="http://maps.google.com/?q=a" />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('no renderiza nada si la URL no se puede leer', () => {
    render(<MapsLinkCard url="esto no es una url" />)
    expect(screen.queryByRole('link')).toBeNull()
  })
})
