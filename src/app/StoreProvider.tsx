import type { ReactNode } from 'react'
import type { StoreConfig, Catalog, StoreContent } from '@/types'
import { storeConfig as defaultConfig } from '@/store-pack/config'
import { catalog as defaultCatalog } from '@/store-pack/catalog'
import { storeContent as defaultContent } from '@/store-pack/content'
import { StoreContext } from './store-context'

interface StoreProviderProps {
  config?: StoreConfig
  catalog?: Catalog
  content?: StoreContent
  children: ReactNode
}

export function StoreProvider({
  config = defaultConfig,
  catalog = defaultCatalog,
  content = defaultContent,
  children,
}: StoreProviderProps) {
  return (
    <StoreContext.Provider value={{ config, catalog, content }}>
      {children}
    </StoreContext.Provider>
  )
}
