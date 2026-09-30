import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useStoreConfig } from '@/app/store'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet/ResponsiveSheet'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format-currency'
import { useCart } from '../CartContext'
import { useCartLineViews } from '../useCartLineViews'
import { useCartPanel } from '../useCartPanel'
import { CartLineItem } from './CartLineItem'

export function CartSheet() {
  const { isOpen, close } = useCartPanel()
  const config = useStoreConfig()
  const cart = useCart()
  const views = useCartLineViews()

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      title="Tu pedido"
      description="Revisá los productos antes de enviarlo."
    >
      {cart.isEmpty ? (
        <div className="p-4">
          <EmptyState
            icon={ShoppingBag}
            title="Tu pedido está vacío"
            description="Agregá productos del catálogo para armarlo."
          />
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y overflow-y-auto px-4">
            {views.map((view) => (
              <CartLineItem
                key={view.lineId}
                view={view}
                currency={config.currency}
                maxQty={config.maxQtyPerLine}
                onQtyChange={cart.setQty}
                onRemove={cart.removeLine}
              />
            ))}
          </ul>

          <div className="space-y-2 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {cart.totals.discount > 0 && (
              <>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(cart.totals.subtotal, config.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Promo por cantidad</span>
                  <span>
                    − {formatCurrency(cart.totals.discount, config.currency)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(cart.totals.total, config.currency)}</span>
            </div>

            {/* TEMPORAL: en las Fases 8-9 esto pasa a ser un enlace a /pedido */}
            <Button
              className="w-full"
              size="lg"
              onClick={() => toast('El checkout llega en la Fase 9')}
            >
              Continuar con el pedido
            </Button>
            <Button variant="ghost" className="w-full" onClick={cart.clear}>
              Vaciar pedido
            </Button>
          </div>
        </>
      )}
    </ResponsiveSheet>
  )
}
