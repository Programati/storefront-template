import { createContext, useContext } from 'react'
import type { StoreConfig, Catalog, StoreContent } from '@/types'

export interface StoreContextValue {
  config: StoreConfig
  catalog: Catalog
  content: StoreContent
}

export const StoreContext = createContext<StoreContextValue | null>(null)

function useStoreContext() {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error(
      'useStoreConfig/useCatalog/useStoreContent deben usarse dentro de <StoreProvider>',
    )
  }
  return ctx
}

export function useStoreConfig(): StoreConfig {
  return useStoreContext().config
}

export function useCatalog(): Catalog {
  return useStoreContext().catalog
}

export function useStoreContent(): StoreContent {
  return useStoreContext().content
}
