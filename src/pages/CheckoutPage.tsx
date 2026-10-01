import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { useStoreConfig } from '@/app/store'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { Section } from '@/components/shared/Section/Section'
import { buttonVariants } from '@/components/ui/button'
import { useCart } from '@/features/cart'
import { formatCurrency } from '@/lib/format-currency'

export function CheckoutPage() {
  const config = useStoreConfig()
  const cart = useCart()

  if (cart.isEmpty) {
    return (
      <Section title="Tu pedido">
        <EmptyState
          icon={ShoppingBag}
          title="Tu pedido está vacío"
          description="Agregá productos del catálogo para poder enviarlo."
          action={
            <Link to="/catalogo" className={buttonVariants()}>
              Ir al catálogo
            </Link>
          }
        />
      </Section>
    )
  }

  return (
    <Section
      title="Confirmar pedido"
      description="Acá van el formulario de entrega y el envío por WhatsApp (Fase 9)."
    >
      <p>
        {cart.unitCount} {cart.unitCount === 1 ? 'unidad' : 'unidades'} ·{' '}
        {formatCurrency(cart.totals.total, config.currency)}
      </p>
    </Section>
  )
}
