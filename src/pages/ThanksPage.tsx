import { PartyPopper } from 'lucide-react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { Section } from '@/components/shared/Section/Section'
import { buttonVariants } from '@/components/ui/button'

export function ThanksPage() {
  return (
    <Section>
      <EmptyState
        icon={PartyPopper}
        title="¡Gracias por tu pedido!"
        description="Acá vamos a mostrar el resumen y el código del pedido (Fase 9)."
        action={
          <Link to="/catalogo" className={buttonVariants()}>
            Seguir viendo productos
          </Link>
        }
      />
    </Section>
  )
}
