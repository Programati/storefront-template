import { CircleCheck, Copy, MessageCircle } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { useStoreConfig } from '@/app/store'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { Section } from '@/components/shared/Section/Section'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  OrderSummary,
  prepareOrderMessage,
  useLastOrder,
} from '@/features/checkout'
import { copyToClipboard } from '@/lib/clipboard'
import { cn } from '@/lib/utils'
import { StorePageMeta } from '@/app/StorePageMeta'

function ThanksContent() {
  const config = useStoreConfig()
  const order = useLastOrder()
  const prepared = useMemo(
    () => (order ? prepareOrderMessage(order, config) : null),
    [order, config],
  )

  // Sin pedido válido (pestaña nueva, link directo, datos viejos): no hay nada que mostrar.
  if (!order || !prepared) {
    return (
      <Section>
        <EmptyState
          title="No hay un pedido reciente"
          description="Cuando envíes un pedido, vas a ver su resumen acá."
          action={
            <Link to="/catalogo" className={buttonVariants()}>
              Ir al catálogo
            </Link>
          }
        />
      </Section>
    )
  }

  async function handleCopy() {
    const ok = await copyToClipboard(prepared!.message)
    if (ok) toast.success('Mensaje copiado')
    else
      toast.error(
        'No pudimos copiarlo. Podés seleccionarlo desde "Ver el mensaje".',
      )
  }

  return (
    <Section>
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-2 text-center">
          <CircleCheck
            className="mx-auto size-12 text-primary"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold">Tu pedido está listo</h1>
          <p className="text-muted-foreground">
            Código <strong className="text-foreground">{order.code}</strong>.
            Falta un paso: enviá el mensaje en WhatsApp para que{' '}
            {config.storeName} lo reciba.
          </p>
        </div>

        {!prepared.includesMessage && (
          <p
            role="note"
            className="rounded-md border border-dashed p-3 text-sm"
          >
            Tu pedido es largo para ir en un solo enlace, así que abrimos el
            chat sin texto. Pegá el mensaje: si no se copió solo, usá "Copiar
            mensaje".
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={prepared.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), 'flex-1')}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Abrir WhatsApp
          </a>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleCopy}
          >
            <Copy className="size-4" aria-hidden="true" />
            Copiar mensaje
          </Button>
        </div>

        <OrderSummary
          lines={order.lines}
          totals={order.totals}
          currency={config.currency}
        />

        <details className="rounded-md border p-3 text-sm">
          <summary className="cursor-pointer font-medium">
            Ver el mensaje
          </summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-sans text-muted-foreground">
            {prepared.message}
          </pre>
        </details>

        <Link
          to="/catalogo"
          className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
        >
          Hacer otro pedido
        </Link>
      </div>
    </Section>
  )
}

export function ThanksPage() {
  return (
    <>
      <StorePageMeta pageTitle="Pedido enviado" noindex />
      <ThanksContent />
    </>
  )
}
