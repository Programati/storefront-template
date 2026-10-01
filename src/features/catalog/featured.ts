import type { Product } from '@/types'

// Los marcados con `featured: true`; si el catálogo no marcó ninguno, los primeros.
export function pickFeatured(products: Product[], limit = 6): Product[] {
  const flagged = products.filter((p) => p.featured)
  return (flagged.length > 0 ? flagged : products).slice(0, limit)
}
