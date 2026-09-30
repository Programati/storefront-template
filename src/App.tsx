import '@/store-pack/fonts'
import { StoreProvider, useStoreConfig, useCatalog } from '@/app/store'
import { Toaster } from '@/components/ui/sonner'

function DebugHome() {
  const config = useStoreConfig()
  const catalog = useCatalog()

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold">{config.storeName}</h1>
      <p className="text-muted-foreground">{config.tagline}</p>
      <ul className="mt-6 space-y-2">
        {catalog.products.map((p) => (
          <li key={p.id}>
            {p.name} {p.soldOut ? '(agotado)' : ''}
          </li>
        ))}
      </ul>
    </main>
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
