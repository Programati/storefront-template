// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { StoreProvider } from '@/app/store'
import type { Catalog, HomeSection, StoreConfig } from '@/types'
import { HomeSections } from './HomeSections'

const config: StoreConfig = {
  storeName: 'Tienda Test',
  whatsappNumber: '5491100000000',
  currency: 'ARS',
  maxQtyPerLine: 10,
  deliveryMethods: [],
}

const catalog: Catalog = { categories: [], products: [], pricingRules: [] }

function renderSections(sections: HomeSection[]) {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <StoreProvider config={config} catalog={catalog}>
          <HomeSections sections={sections} />
        </StoreProvider>
      ),
    },
  ])
  return render(<RouterProvider router={router} />)
}

const hero: HomeSection = { type: 'hero', ctaLabel: 'Mirá todo' }
const howToOrder: HomeSection = {
  type: 'howToOrder',
  title: 'Cómo pedir',
  steps: [{ title: 'Elegí', description: 'Elegí tus productos.' }],
}
const faq: HomeSection = {
  type: 'faq',
  title: 'Preguntas',
  items: [{ question: '¿Cómo pago?', answer: 'Por WhatsApp.' }],
}

describe('HomeSections', () => {
  afterEach(cleanup)

  it('renderiza las secciones en el orden de la lista', () => {
    renderSections([hero, faq, howToOrder])

    const titles = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent)
    expect(titles).toEqual(['Preguntas', 'Cómo pedir'])
  })

  it('no renderiza las secciones que no están en la lista', () => {
    renderSections([faq])

    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Cómo pedir' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Preguntas' })).toBeTruthy()
  })

  it('el hero muestra el nombre de la tienda y un CTA al catálogo', () => {
    renderSections([hero])

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tienda Test' }),
    ).toBeTruthy()
    const cta = screen.getByRole('link', { name: 'Mirá todo' })
    expect(cta.getAttribute('href')).toBe('/catalogo')
  })

  it('la FAQ muestra pregunta y respuesta', () => {
    renderSections([faq])

    expect(screen.getByText('¿Cómo pago?')).toBeTruthy()
    expect(screen.getByText('Por WhatsApp.')).toBeTruthy()
  })
})
