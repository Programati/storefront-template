// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BrandIcon } from './BrandIcon'
import { FACEBOOK_PATH, INSTAGRAM_PATH, WHATSAPP_PATH } from './brandIconPaths'

afterEach(cleanup)

describe('brandIconPaths', () => {
  it.each([
    ['whatsapp', WHATSAPP_PATH],
    ['facebook', FACEBOOK_PATH],
    ['instagram', INSTAGRAM_PATH],
  ] as const)('%s es un path de una sola línea', (_name, path) => {
    // Si falla, el archivo se generó con cortes de línea: volver a generarlo.
    expect(path).toMatch(/^M[^\n\r]+$/)
  })
})

describe('BrandIcon', () => {
  it('dibuja el path dentro de un svg decorativo', () => {
    const { container } = render(<BrandIcon name="instagram" />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    )
    expect(container.querySelector('path')?.getAttribute('d')).toBe(
      INSTAGRAM_PATH,
    )
  })
})
