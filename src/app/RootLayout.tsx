// src/app/RootLayout.tsx
import { Link, Outlet, ScrollRestoration } from 'react-router'
import { SiteHeader } from '@/components/shared/SiteHeader/SiteHeader'
import {
  CartButton,
  CartFloatingBar,
  CartSheet,
  ProductOptionsSheet,
  useCart,
} from '@/features/cart'
import { cn } from '@/lib/utils'
import { MainNav } from './MainNav'
import { useStoreConfig, useStoreContent } from './store'
import { DemoNotice } from '@/components/shared/DemoNotice/DemoNotice'

export function RootLayout() {
  const config = useStoreConfig()
  const content = useStoreContent()
  const cart = useCart()

  return (
    <div className="min-h-dvh">
      {content.demoNotice && <DemoNotice message={content.demoNotice} />}
      <SiteHeader
        brand={<Link to="/">{config.storeName}</Link>}
        nav={<MainNav />}
        actions={<CartButton />}
      />
      {/* El padding evita que la barra flotante tape el final de la página en móvil */}
      <main className={cn(!cart.isEmpty && 'pb-24 md:pb-0')}>
        <Outlet />
      </main>
      <ProductOptionsSheet />
      <CartSheet />
      <CartFloatingBar />
      <ScrollRestoration />
    </div>
  )
}
