// src/components/shared/SmartImage/SmartImage.tsx
import { useState } from 'react'
import type { ImageResolver } from '@/lib/images'
import { cn } from '@/lib/utils'

interface SmartImageProps {
  /** Ruta relativa dentro del almacén de imágenes. */
  path: string
  alt: string
  resolver: ImageResolver
  /** Qué ancho ocupa la imagen en pantalla. Ej: '(min-width: 1024px) 33vw, 100vw'. */
  sizes: string
  /** Dimensiones intrínsecas (definen la proporción, evitan saltos de layout y fijan el `src`). */
  width?: number
  height?: number
  /** Anchos candidatos del srcset. Si falta, usa los del resolvedor. */
  widths?: readonly number[]
  /** Solo la imagen principal visible al cargar (LCP). */
  priority?: boolean
  className?: string
}

export function SmartImage({
  path,
  alt,
  resolver,
  sizes,
  width = 400,
  height = 400,
  widths,
  priority = false,
  className,
}: SmartImageProps) {
  const { src, srcSet } = resolver(path, { width, widths })
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (failedSrc === src) {
    return (
      <div role="img" aria-label={alt} className={cn('bg-muted', className)} />
    )
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={className}
    />
  )
}
