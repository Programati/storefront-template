import { ProductGrid } from '@/components/shared/ProductGrid/ProductGrid'
import { Section } from '@/components/shared/Section/Section'
import { useFeaturedProducts } from '@/features/catalog'
import { useProductGridProps } from '../hooks/useProductGridProps'

interface FeaturedSectionProps {
  title: string
}

export function FeaturedSection({ title }: FeaturedSectionProps) {
  const featured = useFeaturedProducts()
  const gridProps = useProductGridProps()
  return (
    <Section title={title}>
      <ProductGrid products={featured} {...gridProps} />
    </Section>
  )
}
