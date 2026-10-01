import { useMemo } from 'react'
import type { Category, Product } from '@/types'
import { useCatalogRepository } from './useCatalogRepository'
import type { ProductFilter } from './types'
import { pickFeatured } from './featured'

export function useProducts(filter?: ProductFilter): Product[] {
  const repo = useCatalogRepository()
  const { categoryId, brandId, query } = filter ?? {}

  // Reconstruimos el filtro a partir de sus campos primitivos: esta referencia
  // solo cambia cuando alguno de los tres realmente cambia, nunca por un
  // objeto literal nuevo en cada render.
  const stableFilter = useMemo<ProductFilter>(
    () => ({ categoryId, brandId, query }),
    [categoryId, brandId, query],
  )

  return useMemo(() => repo.getProducts(stableFilter), [repo, stableFilter])
}

export function useCategories(): Category[] {
  const repo = useCatalogRepository()
  return useMemo(() => repo.getCategories(), [repo])
}

export function useProductBySlug(slug: string): Product | undefined {
  const repo = useCatalogRepository()
  return useMemo(() => repo.getProductBySlug(slug), [repo, slug])
}

export function useFeaturedProducts(limit = 6): Product[] {
  const products = useProducts()
  return useMemo(() => pickFeatured(products, limit), [products, limit])
}
