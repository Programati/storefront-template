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
import { StoreBrand } from './StoreBrand'
import { StoreFooter } from './StoreFooter'
import { useStoreContent } from './store'
import { DemoNotice } from '@/components/shared/DemoNotice/DemoNotice'

export function RootLayout() {
  const content = useStoreContent()
  const cart = useCart()

  return (
    <div className="flex min-h-dvh flex-col">
      {content.demoNotice && <DemoNotice message={content.demoNotice} />}
      <SiteHeader
        brand={
          <Link to="/">
            <StoreBrand />
          </Link>
        }
        nav={<MainNav />}
        actions={<CartButton />}
      />
      {/* El padding evita que la barra flotante tape el final de la página en móvil */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* El padding evita que la barra flotante tape el final del footer en móvil */}
      <div className={cn(!cart.isEmpty && 'pb-24 md:pb-0')}>
        <StoreFooter />
      </div>
      <ProductOptionsSheet />
      <CartSheet />
      <CartFloatingBar />
      <ScrollRestoration />
    </div>
  )
}
