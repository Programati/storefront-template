import { normalizeText } from '@/lib/normalize-text'
import type { Product } from '@/types'
import type { ProductFilter } from './types'

export function filterProducts(
  products: Product[],
  filter: ProductFilter = {},
): Product[] {
  return products.filter((product) => {
    if (filter.categoryId && product.categoryId !== filter.categoryId)
      return false
    if (filter.brandId && product.brandId !== filter.brandId) return false

    if (filter.query) {
      const haystack = normalizeText(`${product.name} ${product.description}`)
      if (!haystack.includes(normalizeText(filter.query))) return false
    }

    return true
  })
}
