// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SiteBrand } from './SiteBrand'

afterEach(cleanup)

const logo = <img src="/logo.webp" alt="Logo de la tienda" />

describe('SiteBrand', () => {
  it('sin logo muestra el nombre', () => {
    render(<SiteBrand name="Mi Tienda" />)
    expect(screen.getByText('Mi Tienda')).toBeTruthy()
  })

  it('con logo muestra solo el logo', () => {
    render(<SiteBrand name="Mi Tienda" logo={logo} />)
    expect(screen.getByRole('img', { name: 'Logo de la tienda' })).toBeTruthy()
    expect(screen.queryByText('Mi Tienda')).toBeNull()
  })

  it('con logo y showName muestra los dos', () => {
    render(<SiteBrand name="Mi Tienda" logo={logo} showName />)
    expect(screen.getByRole('img', { name: 'Logo de la tienda' })).toBeTruthy()
    expect(screen.getByText('Mi Tienda')).toBeTruthy()
  })
})
