import { Link } from 'react-router'
import { useStoreConfig } from '@/app/store'
import { useImageResolver } from '@/app/useImageResolver'
import { BannerCarousel } from '@/components/shared/BannerCarousel/BannerCarousel'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BannerImage } from '@/types'

const BANNER_SIZES = '100vw'
const BANNER_WIDTHS = [640, 960, 1280, 1600] as const

interface HeroSectionProps {
  ctaLabel: string
  banners?: readonly BannerImage[]
}

interface HeroContentProps {
  ctaLabel: string
  /** true cuando el texto va encima de las fotos del banner. */
  onImage?: boolean
}

function HeroContent({ ctaLabel, onImage = false }: HeroContentProps) {
  const config = useStoreConfig()
  return (
    <div
      className={cn(
        'mx-auto max-w-6xl px-4 py-16 text-center sm:py-24',
        onImage && 'pb-20 sm:pb-24',
      )}
    >
      <h1
        className={cn(
          'text-4xl font-bold tracking-tight sm:text-5xl',
          onImage && 'text-white',
        )}
      >
        {config.storeName}
      </h1>
      {config.tagline && (
        <p
          className={cn(
            'mx-auto mt-4 max-w-xl text-lg',
            onImage ? 'text-white/90' : 'text-muted-foreground',
          )}
        >
          {config.tagline}
        </p>
      )}
      <Link
        to="/catalogo"
        className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

export function HeroSection({ ctaLabel, banners }: HeroSectionProps) {
  const resolveImage = useImageResolver()

  if (banners && banners.length > 0) {
    return (
      <BannerCarousel
        label="Fotos destacadas"
        images={banners}
        resolver={resolveImage}
        sizes={BANNER_SIZES}
        widths={BANNER_WIDTHS}
        className="min-h-[22rem] border-b sm:min-h-[28rem]"
      >
        <HeroContent ctaLabel={ctaLabel} onImage />
      </BannerCarousel>
    )
  }

  return (
    <section className="border-b bg-muted/40">
      <HeroContent ctaLabel={ctaLabel} />
    </section>
  )
}
