import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { SmartImage } from '@/components/shared/SmartImage/SmartImage'
import type { ImageResolver } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/types'

interface BannerCarouselProps {
  images: readonly ProductImage[]
  resolver: ImageResolver
  /** Qué ancho ocupa la foto en pantalla. Ej: '100vw'. */
  sizes: string
  widths?: readonly number[]
  /** Milisegundos entre fotos. */
  intervalMs?: number
  /** Nombre accesible del carrusel. */
  label: string
  /** Contenido que va encima de las fotos (título, botón). */
  children?: ReactNode
  className?: string
}

const DEFAULT_INTERVAL_MS = 5000

const arrowClass =
  'absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function BannerCarousel({
  images,
  resolver,
  sizes,
  widths,
  intervalMs = DEFAULT_INTERVAL_MS,
  label,
  children,
  className,
}: BannerCarouselProps) {
  const count = images.length
  const [index, setIndex] = useState(0)
  // La primera foto aparece sin fundido (cuenta para el LCP); el fundido
  // empieza recién cuando la foto cambia por primera vez.
  const [hasChanged, setHasChanged] = useState(false)
  // Con "reducir movimiento" en el sistema no hay rotación automática:
  // se navega solo con las flechas y los puntos. Se lee una vez al montar.
  const [autoplay] = useState(() => !prefersReducedMotion())

  // `index` está en las dependencias para reiniciar la cuenta cada vez que
  // el usuario cambia de foto a mano (flechas o puntos).
  useEffect(() => {
    if (!autoplay || count < 2) return undefined
    const id = window.setTimeout(() => {
      setHasChanged(true)
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => window.clearTimeout(id)
  }, [index, autoplay, count, intervalMs])

  const active = Math.min(index, count - 1)
  const current = images[active]
  if (!current) return null

  const go = (next: (i: number) => number) => {
    setHasChanged(true)
    setIndex(next)
  }
  const goNext = () => go((i) => (i + 1) % count)
  const goPrev = () => go((i) => (i - 1 + count) % count)

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={label}
      className={cn('relative isolate overflow-hidden bg-muted', className)}
    >
      <div aria-live={autoplay ? 'off' : 'polite'} className="absolute inset-0">
        <SmartImage
          key={current.path}
          path={current.path}
          alt={current.alt}
          resolver={resolver}
          sizes={sizes}
          widths={widths}
          width={1600}
          height={900}
          priority={active === 0}
          className={cn(
            'absolute inset-0 size-full object-cover',
            hasChanged &&
              'animate-in duration-700 fade-in motion-reduce:animate-none',
          )}
        />
      </div>
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="relative">{children}</div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto anterior"
            className={cn(arrowClass, 'left-2')}
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Foto siguiente"
            className={cn(arrowClass, 'right-2')}
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1">
            {images.map((image, i) => (
              <button
                key={image.path}
                type="button"
                onClick={() => go(() => i)}
                aria-label={`Ver imagen ${i + 1} de ${count}`}
                aria-current={i === active ? 'true' : undefined}
                className="grid size-6 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'block size-2.5 rounded-full',
                    i === active ? 'bg-white' : 'bg-white/50',
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
