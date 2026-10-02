import { describe, expect, it } from 'vitest'
import { parseThemeCss } from './parseThemeCss'

const CSS = `
:root { --a: oklch(1 0 0); /* --b: red; */ --radius: 1rem; }
.dark { --a: oklch(0 0 0); --c: oklch(1 0 0 / 10%); }
`

describe('parseThemeCss', () => {
  it('ignora tokens comentados', () => {
    expect(parseThemeCss(CSS).light.b).toBeUndefined()
  })
  it('.dark hereda lo que no redefine', () => {
    const { dark } = parseThemeCss(CSS)
    expect(dark.radius).toBe('1rem')
    expect(dark.a).toBe('oklch(0 0 0)')
  })
  it('conserva la transparencia en el valor', () => {
    expect(parseThemeCss(CSS).dark.c).toBe('oklch(1 0 0 / 10%)')
  })
})
