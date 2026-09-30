// src/App.tsx
import '@/store-pack/fonts'
import { toast } from 'sonner'
import { StoreProvider, useStoreConfig, useCatalog } from '@/app/store'
import { Toaster } from '@/components/ui/sonner'
import { Section } from '@/components/shared/Section/Section'
import { ProductCard } from '@/components/shared/ProductCard/ProductCard'

function DebugHome() {
  const config = useStoreConfig()
  const catalog = useCatalog()

  return (
    <Section title={config.storeName} description={config.tagline}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={config.currency}
            maxQty={config.maxQtyPerLine}
            look="catalog"
            onAdd={(p, _variantId, qty) =>
              toast.success(`Agregado: ${qty} × ${p.name}`)
            }
            onOpenOptions={(p) =>
              toast(`Abrir opciones de "${p.name}" (llega en la Fase 7)`)
            }
          />
        ))}
      </div>
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
