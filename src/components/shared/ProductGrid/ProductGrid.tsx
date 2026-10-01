import type { ComponentProps } from 'react'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import type { Product } from '@/types'

type CardProps = ComponentProps<typeof ProductCard>

// Las columnas y el `sizes` viven juntos: si cambiás una, cambiá la otra.
// 1 col (<640px) = 100vw · 2 cols (≥640px) = 50vw · 3 cols (≥1024px) = 33vw
const GRID_CLASSES = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
const GRID_IMAGE_SIZES =
  '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

interface ProductGridProps extends Pick<
  CardProps,
  'currency' | 'maxQty' | 'look' | 'resolveImage' | 'onAdd' | 'onOpenOptions'
> {
  products: Product[]
  emptyTitle?: string
  emptyDescription?: string
}

export function ProductGrid({
  products,
  emptyTitle = 'Sin resultados',
  emptyDescription = 'Probá con otra búsqueda.',
  ...cardProps
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={GRID_CLASSES}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          imageSizes={GRID_IMAGE_SIZES}
          {...cardProps}
        />
      ))}
    </div>
  )
}
