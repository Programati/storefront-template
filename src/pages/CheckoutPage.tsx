import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { useStoreConfig } from '@/app/store'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { Section } from '@/components/shared/Section/Section'
import { buttonVariants } from '@/components/ui/button'
import { useCart } from '@/features/cart'
import {
  CheckoutForm,
  OrderSummary,
  useCheckoutForm,
} from '@/features/checkout'
import { StorePageMeta } from '@/app/StorePageMeta'

function CheckoutContent() {
  const config = useStoreConfig()
  const cart = useCart()
  const checkout = useCheckoutForm()

  // Pedido enviado: el carrito ya se vació y estamos pasando a /gracias.
  if (checkout.sent) {
    return (
      <Section>
        <p role="status" className="py-24 text-center text-muted-foreground">
          Preparando tu pedido…
        </p>
      </Section>
    )
  }

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
      description="Completá tus datos y enviá el pedido por WhatsApp."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* En móvil el resumen va primero (se revisa antes de completar); en escritorio, al costado */}
        <div className="lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <h2 className="mb-3 font-semibold">Tu pedido</h2>
          <OrderSummary
            lines={checkout.lines}
            totals={cart.totals}
            currency={config.currency}
          />
        </div>

        <CheckoutForm
          values={checkout.values}
          errors={checkout.errors}
          deliveryMethods={config.deliveryMethods}
          scheduling={config.scheduling ?? 'date'}
          locationLink={config.locationLink ?? false}
          minDate={checkout.today}
          onChange={checkout.setField}
          onSubmit={checkout.submit}
        />
      </div>
    </Section>
  )
}

export function CheckoutPage() {
  return (
    <>
      <StorePageMeta pageTitle="Tu pedido" noindex />
      <CheckoutContent />
    </>
  )
}
