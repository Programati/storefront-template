import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/shared/SiteHeader/SiteHeader'
import {
  CartButton,
  CartFloatingBar,
  CartSheet,
  ProductOptionsSheet,
  useCart,
} from '@/features/cart'
import { cn } from '@/lib/utils'
import { useStoreConfig } from './store'

// Hoy recibe `children`; en la Fase 8 pasa a renderizar <Outlet /> del router.
export function RootLayout({ children }: { children: ReactNode }) {
  const config = useStoreConfig()
  const cart = useCart()

  return (
    <div className="min-h-dvh">
      <SiteHeader title={config.storeName} actions={<CartButton />} />
      {/* El padding evita que la barra flotante tape el final de la página en móvil */}
      <main className={cn(!cart.isEmpty && 'pb-24 md:pb-0')}>{children}</main>
      <ProductOptionsSheet />
      <CartSheet />
      <CartFloatingBar />
    </div>
  )
}
