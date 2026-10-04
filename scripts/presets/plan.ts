/** Archivos que componen un preset (los mismos que tiene src/store-pack). */
export const PRESET_FILES = [
  'config.ts',
  'catalog.ts',
  'content.ts',
  'theme.css',
  'fonts.ts',
] as const

// Minúsculas, números y guiones simples. Evita "../" y separadores de ruta.
const PRESET_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidPresetId(id: string): boolean {
  return PRESET_ID.test(id)
}

export function missingPresetFiles(existing: readonly string[]): string[] {
  return PRESET_FILES.filter((file) => !existing.includes(file))
}

// "@fontsource/poppins/400.css" → "@fontsource/poppins"
const FONT_IMPORT =
  /['"](@fontsource(?:-variable)?\/[a-z0-9-]+)(?:\/[^'"]*)?['"]/g

export function fontPackages(fontsSource: string): string[] {
  const names = Array.from(fontsSource.matchAll(FONT_IMPORT), (m) => m[1])
  return [...new Set(names)]
}

export interface PackageDeps {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function missingDependencies(
  packages: readonly string[],
  pkg: PackageDeps,
): string[] {
  const installed = { ...pkg.devDependencies, ...pkg.dependencies }
  return packages.filter((name) => !(name in installed))
}
