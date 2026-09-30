import { ArrowRight } from 'lucide-react'
import { useStoreConfig } from '@/app/store'
import { formatCurrency } from '@/lib/format-currency'
import { useCart } from '../CartContext'
import { useCartPanel } from '../useCartPanel'

// Solo en móvil: es el atajo al pedido con el pulgar, como en Dulce Olivia.
export function CartFloatingBar() {
  const config = useStoreConfig()
  const cart = useCart()
  const { open } = useCartPanel()

  if (cart.isEmpty) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-in p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] duration-300 slide-in-from-bottom motion-reduce:animate-none md:hidden">
      <button
        type="button"
        onClick={open}
        className="flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground shadow-lg"
      >
        <span className="text-sm font-medium">
          {cart.unitCount} {cart.unitCount === 1 ? 'unidad' : 'unidades'} ·{' '}
          {formatCurrency(cart.totals.total, config.currency)}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold">
          Ver pedido <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </button>
    </div>
  )
}
