// src/app/RouteError.tsx
import { TriangleAlert } from 'lucide-react'
import { Link, useRouteError } from 'react-router'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { Button, buttonVariants } from '@/components/ui/button'

// Tras un deploy nuevo, los archivos con hash de la versión anterior dejan de
// existir: una pestaña vieja falla al pedir una página y hay que recargar.
const CHUNK_ERROR =
  /dynamically imported module|importing a module script failed|error loading dynamically/i

export function RouteError() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : String(error)
  const isChunkError = CHUNK_ERROR.test(message)

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-xl items-center justify-center px-4">
      <EmptyState
        icon={TriangleAlert}
        title={
          isChunkError ? 'Hay una versión nueva del sitio' : 'Algo salió mal'
        }
        description={
          isChunkError
            ? 'Recargá la página para continuar.'
            : 'Ocurrió un error inesperado. Probá recargar o volver al inicio.'
        }
        action={
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Recargar</Button>
            <Link to="/" className={buttonVariants({ variant: 'outline' })}>
              Ir al inicio
            </Link>
          </div>
        }
      />
    </div>
  )
}
