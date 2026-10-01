import '@/store-pack/fonts'
import { AppRouter } from '@/app/appRouter'
import { StoreProvider } from '@/app/store'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/features/cart'

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <AppRouter />
        <Toaster position="top-center" />
      </CartProvider>
    </StoreProvider>
  )
}
