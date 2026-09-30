import type { Catalog, Category, Product } from '@/types'
import { filterProducts } from './filters'
import type { ProductFilter } from './types'

export interface CatalogRepository {
  getCategories(): Category[]
  getProducts(filter?: ProductFilter): Product[]
  getProductBySlug(slug: string): Product | undefined
}

// ⚠️ SEAM (punto de cambio futuro): el día que el catálogo venga de una API o
// una BD, esta función se reemplaza por algo como
// `createApiCatalogRepository(baseUrl)`, cuyos métodos devuelven `Promise`.
// Nada fuera de este archivo y de `hooks.ts` (Paso 4.6) debería enterarse.
export function createStaticCatalogRepository(
  catalog: Catalog,
): CatalogRepository {
  return {
    getCategories() {
      return catalog.categories
    },
    getProducts(filter) {
      return filterProducts(catalog.products, filter)
    },
    getProductBySlug(slug) {
      return catalog.products.find((product) => product.slug === slug)
    },
  }
}
