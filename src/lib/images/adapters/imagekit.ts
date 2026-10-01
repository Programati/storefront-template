import type { ImageAdapter } from '../types'
import { cleanPath, clampQuality, clampWidth, trimBase } from '../utils'

export const imagekitAdapter: ImageAdapter = (baseUrl, path, options) => {
  const tr = [
    `w-${clampWidth(options.width)}`,
    `q-${clampQuality(options.quality)}`,
    'f-auto',
  ].join(',')
  return `${trimBase(baseUrl)}/${cleanPath(path)}?tr=${tr}`
}
