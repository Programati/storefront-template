import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { applyPreset, listPresetIds } from './apply'
import { PRESET_FILES } from './plan'

let root: string
let presetsDir: string
let targetDir: string

function createPreset(id: string, files: readonly string[] = PRESET_FILES) {
  const dir = join(presetsDir, id)
  mkdirSync(dir, { recursive: true })
  for (const file of files) writeFileSync(join(dir, file), `${id}:${file}`)
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'presets-'))
  presetsDir = join(root, 'presets')
  targetDir = join(root, 'store-pack')
  mkdirSync(presetsDir)
  mkdirSync(targetDir)
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
})

describe('applyPreset', () => {
  it('copia los archivos del preset con su contenido', () => {
    createPreset('aroma')
    writeFileSync(join(targetDir, 'config.ts'), 'viejo')

    const copied = applyPreset({ presetsDir, targetDir, presetId: 'aroma' })

    expect(copied).toEqual([...PRESET_FILES])
    const content = readFileSync(join(targetDir, 'config.ts'), 'utf8')
    expect(content.length).toBeGreaterThan(0) // guarda: se leyó con contenido
    expect(content).toBe('aroma:config.ts')
  })

  it('si faltan archivos, falla y no toca el destino', () => {
    createPreset('incompleto', ['config.ts', 'catalog.ts'])
    writeFileSync(join(targetDir, 'config.ts'), 'viejo')

    expect(() =>
      applyPreset({ presetsDir, targetDir, presetId: 'incompleto' }),
    ).toThrow(/content\.ts/)

    expect(readFileSync(join(targetDir, 'config.ts'), 'utf8')).toBe('viejo')
    expect(readdirSync(targetDir)).toEqual(['config.ts'])
  })

  it('falla si el preset no existe', () => {
    expect(() =>
      applyPreset({ presetsDir, targetDir, presetId: 'nada' }),
    ).toThrow(/No existe/)
  })

  it('rechaza ids que intentan salir de la carpeta', () => {
    expect(() =>
      applyPreset({ presetsDir, targetDir, presetId: '../store-pack' }),
    ).toThrow(/inválido/)
  })

  it('crea el destino si no existe', () => {
    createPreset('aroma')
    const nuevo = join(root, 'otro-destino')

    applyPreset({ presetsDir, targetDir: nuevo, presetId: 'aroma' })

    expect(existsSync(join(nuevo, 'theme.css'))).toBe(true)
  })
})

describe('listPresetIds', () => {
  it('lista solo carpetas con id válido, ordenadas', () => {
    createPreset('zeta')
    createPreset('alfa')
    mkdirSync(join(presetsDir, 'No Valido'))
    writeFileSync(join(presetsDir, 'suelto.txt'), 'x')

    expect(listPresetIds(presetsDir)).toEqual(['alfa', 'zeta'])
  })

  it('devuelve vacío si la carpeta no existe', () => {
    expect(listPresetIds(join(root, 'no-existe'))).toEqual([])
  })
})
