import { Link } from 'react-router'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { Section } from '@/components/shared/Section/Section'
import { buttonVariants } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <Section>
      <EmptyState
        title="Página no encontrada"
        description="El enlace puede estar desactualizado o la página ya no existe."
        action={
          <Link to="/" className={buttonVariants()}>
            Volver al inicio
          </Link>
        }
      />
    </Section>
  )
}
