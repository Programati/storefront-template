// src/App.tsx
import { useState } from 'react'
import '@/store-pack/fonts'
import { toast } from 'sonner'
import { StoreProvider, useStoreConfig } from '@/app/store'
import { CartProvider, useCart } from '@/features/cart'
import { useCategories, useProducts } from '@/features/catalog'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'
import { Section } from '@/components/shared/Section/Section'
import { formatCurrency } from '@/lib/format-currency'

function DebugHome() {
  const config = useStoreConfig()
  const categories = useCategories()
  const cart = useCart()
  const [query, setQuery] = useState('')
  const products = useProducts({ query })

  return (
    <Section title={config.storeName} description={config.tagline}>
      <div className="mb-4 flex items-center justify-between rounded-md border p-3 text-sm">
        <span>
          🛒 {cart.lines.reduce((n, l) => n + l.qty, 0)} unidades ·{' '}
          {formatCurrency(cart.totals.total, config.currency)}
          {cart.totals.discount > 0 && (
            <span className="text-muted-foreground">
              {' '}
              (ahorrás {formatCurrency(cart.totals.discount, config.currency)})
            </span>
          )}
        </span>
        {!cart.isEmpty && (
          <Button variant="ghost" size="sm" onClick={cart.clear}>
            Vaciar
          </Button>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {categories.length} categorías cargadas.
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
              onAdd={(p, variantId, qty) => {
                cart.addLine({ productId: p.id, variantId, qty })
                toast.success(`Agregado: ${qty} × ${p.name}`)
              }}
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
      <CartProvider>
        <DebugHome />
        <Toaster />
      </CartProvider>
    </StoreProvider>
  )
}
