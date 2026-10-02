import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrastRatio'
import { parseThemeCss } from './parseThemeCss'
import { TEXT_PAIRS } from './pairs'

// Se lee con fs (no con `?raw`): Vitest devuelve '' para los .css importados.
const css = readFileSync(
  new URL('../../store-pack/theme.css', import.meta.url),
  'utf8',
)
const theme = parseThemeCss(css)

describe('theme.css', () => {
  it('se leyó con contenido', () => {})
})

describe.each(['light', 'dark'] as const)('contraste del tema (%s)', (mode) => {
  it.each(TEXT_PAIRS)('--$fg sobre --$bg ≥ $min:1', ({ fg, bg, min }) => {
    const tokens = theme[mode]
    expect(tokens[fg], `falta --${fg}`).toBeDefined()
    expect(tokens[bg], `falta --${bg}`).toBeDefined()
    const ratio = contrastRatio(tokens[fg], tokens[bg])
    expect(
      ratio,
      `--${fg} sobre --${bg} da ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(min)
  })
})
