// src/App.tsx
import { useState } from 'react'
import { BrowserRouter } from 'react-router'
import '@/store-pack/fonts'
import { RootLayout } from '@/app/RootLayout'
import { StoreProvider, useStoreConfig } from '@/app/store'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import { Section } from '@/components/shared/Section/Section'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider, useAddToCart } from '@/features/cart'
import { useProductPanel, useProducts } from '@/features/catalog'

function DebugHome() {
  const config = useStoreConfig()
  const addToCart = useAddToCart()
  const productPanel = useProductPanel()
  const [query, setQuery] = useState('')
  const products = useProducts({ query })

  return (
    <Section title={config.storeName} description={config.tagline}>
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
              onAdd={(p, variantId, qty) => addToCart(p, { variantId, qty })}
              onOpenOptions={(p) => productPanel.open(p.slug)}
            />
          ))}
        </div>
      )}
    </Section>
  )
}

export default function App() {
  return (
    // TEMPORAL: BrowserRouter existe solo para que useSearchParams funcione.
    // En la Fase 8 lo reemplaza AppRouter y App vuelve a su forma final.
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <RootLayout>
            <DebugHome />
          </RootLayout>
          {/* Arriba, para no tapar la barra flotante del pedido en móvil */}
          <Toaster position="top-center" />
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
