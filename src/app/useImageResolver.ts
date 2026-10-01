import { useMemo } from 'react'
import { useStoreConfig } from '@/app/store'
import { createImageResolver, type ImageResolver } from '@/lib/images'

/** Resolvedor de URLs de imagen según `config.images` (placeholder si falta). */
export function useImageResolver(): ImageResolver {
  const { images } = useStoreConfig()
  return useMemo(() => createImageResolver(images), [images])
}
