import type { ImageConfig, ImageProvider } from '@/types'
import { imagekitAdapter } from './adapters/imagekit'
import { placeholderAdapter } from './adapters/placeholder'
import type { ImageAdapter, ImageResolver } from './types'

export const DEFAULT_WIDTH = 640
export const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280] as const

const ADAPTERS: Record<ImageProvider, ImageAdapter> = {
  imagekit: imagekitAdapter,
  placeholder: placeholderAdapter,
}

export function createImageResolver(config?: ImageConfig): ImageResolver {
  const adapter = ADAPTERS[config?.provider ?? 'placeholder']
  const baseUrl = config?.baseUrl ?? ''

  return (path, options = {}) => {
    const { width = DEFAULT_WIDTH, widths = DEFAULT_WIDTHS, quality } = options
    return {
      src: adapter(baseUrl, path, { width, quality }),
      srcSet: widths
        .map((w) => `${adapter(baseUrl, path, { width: w, quality })} ${w}w`)
        .join(', '),
    }
  }
}
