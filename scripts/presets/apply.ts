import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { isValidPresetId, missingPresetFiles, PRESET_FILES } from './plan'

export function listPresetIds(presetsDir: string): string[] {
  if (!existsSync(presetsDir)) return []
  return readdirSync(presetsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isValidPresetId(entry.name))
    .map((entry) => entry.name)
    .sort()
}

interface ApplyPresetOptions {
  presetsDir: string
  targetDir: string
  presetId: string
}

/** Copia los archivos del preset sobre targetDir. Valida todo ANTES de copiar. */
export function applyPreset({
  presetsDir,
  targetDir,
  presetId,
}: ApplyPresetOptions): string[] {
  if (!isValidPresetId(presetId)) {
    throw new Error(
      `Id de preset inválido: "${presetId}". Usá minúsculas, números y guiones.`,
    )
  }
  const sourceDir = join(presetsDir, presetId)
  if (!existsSync(sourceDir)) {
    throw new Error(`No existe el preset "${presetId}" en ${presetsDir}`)
  }
  const missing = missingPresetFiles(readdirSync(sourceDir))
  if (missing.length > 0) {
    throw new Error(
      `Al preset "${presetId}" le faltan archivos: ${missing.join(', ')}`,
    )
  }

  mkdirSync(targetDir, { recursive: true })
  for (const file of PRESET_FILES) {
    copyFileSync(join(sourceDir, file), join(targetDir, file))
  }
  return [...PRESET_FILES]
}
