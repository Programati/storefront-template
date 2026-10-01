import { LoaderCircle } from 'lucide-react'

// Se muestra solo en la carga inicial, cuando alguien entra directo a una
// página que se descarga bajo demanda.
export function PageSpinner() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="flex min-h-dvh items-center justify-center"
    >
      <LoaderCircle
        className="size-8 animate-spin text-muted-foreground motion-reduce:animate-none"
        aria-hidden="true"
      />
    </div>
  )
}
