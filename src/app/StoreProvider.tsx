import type { ReactNode } from 'react'
import type { StoreConfig, Catalog } from '@/types'
import { storeConfig as defaultConfig } from '@/store-pack/config'
import { catalog as defaultCatalog } from '@/store-pack/catalog'
import { StoreContext } from './store-context'

interface StoreProviderProps {
  config?: StoreConfig
  catalog?: Catalog
  children: ReactNode
}

export function StoreProvider({
  config = defaultConfig,
  catalog = defaultCatalog,
  children,
}: StoreProviderProps) {
  return (
    <StoreContext.Provider value={{ config, catalog }}>
      {children}
    </StoreContext.Provider>
  )
}
