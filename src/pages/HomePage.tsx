import { Link } from 'react-router'
import { useStoreConfig } from '@/app/store'
import { ProductGrid } from '@/components/shared/ProductGrid/ProductGrid'
import { Section } from '@/components/shared/Section/Section'
import { buttonVariants } from '@/components/ui/button'
import {
  CategoryChips,
  useCategories,
  useFeaturedProducts,
} from '@/features/catalog'
import { cn } from '@/lib/utils'
import { useProductGridProps } from './hooks/useProductGridProps'
import { StorePageMeta } from '@/app/StorePageMeta'

export function HomePage() {
  const config = useStoreConfig()
  const categories = useCategories()
  const featured = useFeaturedProducts()
  const gridProps = useProductGridProps()

  return (
    <>
      <StorePageMeta />
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
            Ver catálogo
          </Link>
        </div>
      </section>

      <Section title="Explorá por categoría">
        <CategoryChips categories={categories} />
      </Section>

      <Section title="Destacados">
        <ProductGrid products={featured} {...gridProps} />
      </Section>
    </>
  )
}
