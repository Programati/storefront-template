import { useState } from 'react'
import { SmartImage } from '@/components/shared/SmartImage/SmartImage'
import type { ImageResolver } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/types'

interface ProductGalleryProps {
  /** La primera es la principal. Con una sola foto no se muestran miniaturas. */
  images: readonly ProductImage[]
  resolver: ImageResolver
  /** Qué ancho ocupa la foto principal en pantalla. */
  sizes: string
  widths?: readonly number[]
  className?: string
}

const THUMB_WIDTHS = [96, 192] as const

export function ProductGallery({
  images,
  resolver,
  sizes,
  widths,
  className,
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const active = Math.min(selected, images.length - 1)
  const current = images[active]
  if (!current) return null

  return (
    <div className={cn('space-y-3', className)}>
      <SmartImage
        path={current.path}
        alt={current.alt}
        resolver={resolver}
        sizes={sizes}
        widths={widths}
        width={640}
        height={640}
        className="aspect-square w-full rounded-lg object-cover"
      />
      {images.length > 1 && (
        <div
          role="group"
          aria-label="Fotos del producto"
          className="flex gap-2 overflow-x-auto p-1"
        >
          {images.map((image, index) => (
            <button
              key={image.path}
              type="button"
              aria-label={`Ver foto ${index + 1} de ${images.length}`}
              aria-pressed={index === active}
              onClick={() => setSelected(index)}
              className={cn(
                'size-16 shrink-0 overflow-hidden rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                index === active ? 'border-primary' : 'border-transparent',
              )}
            >
              <SmartImage
                path={image.path}
                alt=""
                resolver={resolver}
                sizes="64px"
                widths={THUMB_WIDTHS}
                width={96}
                height={96}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
