import { useMemo } from 'react'
import { useCatalog } from '@/app/store'
import { createStaticCatalogRepository } from './catalogRepository'
import type { CatalogRepository } from './catalogRepository'

export function useCatalogRepository(): CatalogRepository {
  const catalog = useCatalog()
  return useMemo(() => createStaticCatalogRepository(catalog), [catalog])
}
