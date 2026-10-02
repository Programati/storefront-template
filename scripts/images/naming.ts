/** Ruta canónica: minúsculas, números y guiones, carpetas con "/", extensión .webp. */
export const CANONICAL_PATH = /^[a-z0-9-]+(?:\/[a-z0-9-]+)*\.webp$/

export function isCanonicalPath(path: string): boolean {
  return CANONICAL_PATH.test(path)
}

/** "products/producto-alfa.webp" → "producto-alfa" */
export function fileBaseName(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.[^.]+$/, '')
}

/** "Producto Álfa (1).JPG" → "producto-alfa-1" */
export function normalizeName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
