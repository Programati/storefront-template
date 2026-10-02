export type TokenMap = Record<string, string>

export interface ParsedTheme {
  light: TokenMap
  dark: TokenMap
}

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

function readTokens(css: string, selector: string): TokenMap {
  const tokens: TokenMap = {}
  for (const block of css.matchAll(
    new RegExp(`${selector}\\s*\\{([^}]*)\\}`, 'g'),
  )) {
    for (const decl of block[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      tokens[decl[1]] = decl[2].trim()
    }
  }
  return tokens
}

export function parseThemeCss(css: string): ParsedTheme {
  const clean = stripComments(css)
  const light = readTokens(clean, ':root')
  const dark = { ...light, ...readTokens(clean, '\\.dark') }
  return { light, dark }
}
