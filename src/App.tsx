// src/App.tsx
import { useState } from 'react'
import '@/store-pack/fonts'
import { toast } from 'sonner'
import { StoreProvider, useStoreConfig } from '@/app/store'
import { useProducts, useCategories } from '@/features/catalog'
import { Toaster } from '@/components/ui/sonner'
import { Input } from '@/components/ui/input'
import { Section } from '@/components/shared/Section/Section'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'

function DebugHome() {
  const config = useStoreConfig()
  const categories = useCategories()
  const [query, setQuery] = useState('')
  const products = useProducts({ query })

  return (
    <Section title={config.storeName} description={config.tagline}>
      <p className="mb-4 text-sm text-muted-foreground">
        {categories.length} categorías cargadas desde el repositorio.
      </p>

      <Input
        placeholder="Buscar producto…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 max-w-xs"
      />

      {products.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Probá con otra búsqueda."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={config.currency}
              maxQty={config.maxQtyPerLine}
              onAdd={(p, _variantId, qty) =>
                toast.success(`Agregado: ${qty} × ${p.name}`)
              }
              onOpenOptions={(p) =>
                toast(`Abrir opciones de "${p.name}" (Fase 7)`)
              }
            />
          ))}
        </div>
      )}
    </Section>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <DebugHome />
      <Toaster />
    </StoreProvider>
  )
}
