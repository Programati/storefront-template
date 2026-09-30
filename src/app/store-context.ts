import { createContext, useContext } from 'react'
import type { StoreConfig, Catalog } from '@/types'

export interface StoreContextValue {
  config: StoreConfig
  catalog: Catalog
}

export const StoreContext = createContext<StoreContextValue | null>(null)

function useStoreContext() {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error(
      'useStoreConfig/useCatalog deben usarse dentro de <StoreProvider>',
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
