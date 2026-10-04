import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyPreset, listPresetIds } from './presets/apply'
import {
  fontPackages,
  missingDependencies,
  type PackageDeps,
} from './presets/plan'

const root = fileURLToPath(new URL('..', import.meta.url))
const presetsDir = join(root, 'src', 'presets')
const targetDir = join(root, 'src', 'store-pack')

/** true/false según git; null si no se pudo consultar (por ejemplo, sin repo). */
function hasUncommittedChanges(): boolean | null {
  try {
    const out = execFileSync(
      'git',
      ['status', '--porcelain', '--', 'src/store-pack'],
      { cwd: root, encoding: 'utf8' },
    )
    return out.trim().length > 0
  } catch {
    return null
  }
}

function printPresets(): void {
  const ids = listPresetIds(presetsDir)
  console.log(
    ids.length > 0
      ? `Presets disponibles:\n${ids.map((id) => `  - ${id}`).join('\n')}`
      : 'No hay presets en src/presets.',
  )
  console.log('\nUso: pnpm preset:use <id> [--force]')
}

function main(): void {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const presetId = args.find((arg) => !arg.startsWith('--'))

  if (args.includes('--list')) return printPresets()
  if (!presetId) {
    printPresets()
    process.exitCode = 1
    return
  }

  const dirty = hasUncommittedChanges()
  if (dirty && !force) {
    throw new Error(
      'src/store-pack tiene cambios sin commitear. Commitealos o descartalos, o usá --force para pisarlos.',
    )
  }
  if (dirty === null) {
    console.warn(
      'Aviso: no pude consultar git, así que no verifiqué si hay cambios sin commitear.',
    )
  }

  const copied = applyPreset({ presetsDir, targetDir, presetId })
  console.log(`Preset "${presetId}" aplicado en src/store-pack:`)
  for (const file of copied) console.log(`  - ${file}`)

  const fonts = readFileSync(join(targetDir, 'fonts.ts'), 'utf8')
  const pkg = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf8'),
  ) as PackageDeps
  const missing = missingDependencies(fontPackages(fonts), pkg)
  if (missing.length > 0) {
    console.warn(
      `\nFaltan fuentes instaladas. Corré: pnpm add ${missing.join(' ')}`,
    )
  }
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
