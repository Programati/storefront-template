import type { ImageAdapter } from '../types'
import { clampWidth } from '../utils'

/** Cuadrado 1:1 (igual que la tarjeta). Solo para desarrollo/demo. */
export const placeholderAdapter: ImageAdapter = (_baseUrl, path, options) => {
  const size = clampWidth(options.width)
  const name =
    path
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '') ?? 'imagen'
  return `https://placehold.co/${size}x${size}?text=${encodeURIComponent(name)}`
}

// El de desarrollo reemplaza al placehold.co actual. Ojo con _baseUrl: el guion bajo evita el error noUnusedParameters de tu tsconfig.
