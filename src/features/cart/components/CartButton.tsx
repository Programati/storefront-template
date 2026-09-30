import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '../CartContext'
import { useCartPanel } from '../useCartPanel'

export function CartButton() {
  const { unitCount } = useCart()
  const { open } = useCartPanel()

  return (
    <Button
      variant="outline"
      onClick={open}
      aria-label={`Ver pedido, ${unitCount} ${unitCount === 1 ? 'unidad' : 'unidades'}`}
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Pedido</span>
      {unitCount > 0 && (
        <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-xs font-semibold text-primary-foreground">
          {unitCount}
        </span>
      )}
    </Button>
  )
}
