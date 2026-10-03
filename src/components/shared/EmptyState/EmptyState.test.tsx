// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { EmptyState } from './EmptyState'

afterEach(cleanup)

describe('EmptyState', () => {
  it('muestra título y descripción', () => {
    render(
      <EmptyState title="Sin resultados" description="Probá otra búsqueda" />,
    )
    expect(screen.getByText('Sin resultados')).toBeTruthy()
    expect(screen.getByText('Probá otra búsqueda')).toBeTruthy()
  })

  it('omite la descripción si no se pasa', () => {
    const { container } = render(<EmptyState title="Sin resultados" />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })

  it('renderiza la acción', () => {
    render(<EmptyState title="Vacío" action={<button>Volver</button>} />)
    expect(screen.getByRole('button', { name: 'Volver' })).toBeTruthy()
  })

  it('oculta el ícono a los lectores de pantalla', () => {
    const { container } = render(<EmptyState title="Vacío" />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    )
  })
})
