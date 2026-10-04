import { describe, expect, it } from 'vitest'
import {
  fontPackages,
  isValidPresetId,
  missingDependencies,
  missingPresetFiles,
  PRESET_FILES,
} from './plan'

describe('isValidPresetId', () => {
  it.each(['demo', 'reseller-aroma', 'rubro-2'])('acepta "%s"', (id) => {
    expect(isValidPresetId(id)).toBe(true)
  })

  it.each(['', '../x', 'a/b', 'A', 'a b', '-a', 'a-', 'a--b', '.'])(
    'rechaza "%s"',
    (id) => {
      expect(isValidPresetId(id)).toBe(false)
    },
  )
})

describe('missingPresetFiles', () => {
  it('no informa faltantes si están todos', () => {
    expect(missingPresetFiles([...PRESET_FILES, 'README.md'])).toEqual([])
  })

  it('informa los que faltan', () => {
    expect(missingPresetFiles(['config.ts', 'catalog.ts'])).toEqual([
      'content.ts',
      'theme.css',
      'fonts.ts',
    ])
  })
})

describe('fontPackages', () => {
  it('extrae paquetes sin repetir, sin importar pesos ni comillas', () => {
    const source = [
      "import '@fontsource/poppins/400.css'",
      'import "@fontsource/poppins/700.css"',
      "import '@fontsource-variable/inter'",
    ].join('\n')

    expect(fontPackages(source)).toEqual([
      '@fontsource/poppins',
      '@fontsource-variable/inter',
    ])
  })

  it('devuelve vacío si no hay fuentes', () => {
    expect(fontPackages('// sin fuentes')).toEqual([])
  })
})

describe('missingDependencies', () => {
  const pkg = {
    dependencies: { '@fontsource/poppins': '^5.3.0' },
    devDependencies: { '@fontsource/lora': '^5.0.0' },
  }

  it('reconoce dependencies y devDependencies', () => {
    expect(
      missingDependencies(['@fontsource/poppins', '@fontsource/lora'], pkg),
    ).toEqual([])
  })

  it('informa las que no están', () => {
    expect(missingDependencies(['@fontsource/inter'], pkg)).toEqual([
      '@fontsource/inter',
    ])
  })
})
