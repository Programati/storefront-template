import type { ComponentProps } from 'react'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import type { Product } from '@/types'

type CardProps = ComponentProps<typeof ProductCard>

interface ProductGridProps extends Pick<
  CardProps,
  'currency' | 'maxQty' | 'look' | 'onAdd' | 'onOpenOptions'
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} {...cardProps} />
      ))}
    </div>
  )
}
