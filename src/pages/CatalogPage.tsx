import { useState } from 'react'
import { useParams } from 'react-router'
import { ProductGrid } from '@/components/shared/ProductGrid/ProductGrid'
import { Section } from '@/components/shared/Section/Section'
import { Input } from '@/components/ui/input'
import { CategoryChips, useCategories, useProducts } from '@/features/catalog'
import { useProductGridProps } from './hooks/useProductGridProps'
import { NotFoundPage } from './NotFoundPage'
import { useStoreConfig } from '@/app/store'
import { StorePageMeta } from '@/app/StorePageMeta'

export function CatalogPage() {
  const config = useStoreConfig()
  const { categorySlug } = useParams()
  const categories = useCategories()
  const category = categories.find((c) => c.slug === categorySlug)
  const [query, setQuery] = useState('')
  const products = useProducts({ categoryId: category?.id, query })
  const gridProps = useProductGridProps()

  // Todos los hooks van antes de este retorno (regla de los hooks).
  if (categorySlug && !category) return <NotFoundPage />

  const description = category
    ? `${category.name} de ${config.storeName}. Armá tu pedido y envialo por WhatsApp.`
    : `Catálogo completo de ${config.storeName}. Armá tu pedido y envialo por WhatsApp.`

  return (
    <>
      <StorePageMeta
        pageTitle={category?.name ?? 'Catálogo'}
        description={description}
      />
      <Section title={category?.name ?? 'Catálogo'}>
        <div className="mb-6 space-y-4">
          <CategoryChips categories={categories} />
          <Input
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <ProductGrid products={products} priorityCount={1} {...gridProps} />
      </Section>
    </>
  )
}
