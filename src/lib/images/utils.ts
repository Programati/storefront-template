export const DEFAULT_QUALITY = 80
export const MAX_WIDTH = 3840

export function trimBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '')
}

/** Normaliza una ruta relativa: sin barras sobrantes, sin `.`/`..`, codificada por segmento. */
export function cleanPath(path: string): string {
  return path
    .split('/')
    .filter((s) => s !== '' && s !== '.' && s !== '..')
    .map(encodeURIComponent)
    .join('/')
}

export function clampWidth(width: number): number {
  if (!Number.isFinite(width)) return 1
  return Math.min(MAX_WIDTH, Math.max(1, Math.round(width)))
}

export function clampQuality(quality: number = DEFAULT_QUALITY): number {
  if (!Number.isFinite(quality)) return DEFAULT_QUALITY
  return Math.min(100, Math.max(1, Math.round(quality)))
}
