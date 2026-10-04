import { Link } from 'react-router'
import { useStoreConfig } from '@/app/store'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  ctaLabel: string
}

export function HeroSection({ ctaLabel }: HeroSectionProps) {
  const config = useStoreConfig()
  return (
    <section className="border-b bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {config.storeName}
        </h1>
        {config.tagline && (
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
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
    </section>
  )
}
