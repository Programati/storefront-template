import { formatCurrency } from '@/lib/format-currency'
import type { CartTotals } from '@/features/pricing'
import type { OrderLine } from '../types'

interface OrderSummaryProps {
  lines: OrderLine[]
  totals: CartTotals
  currency: string
}

// Solo lectura: lo usan el checkout (con las líneas del carrito) y /gracias (con las del pedido).
export function OrderSummary({ lines, totals, currency }: OrderSummaryProps) {
  return (
    <div className="rounded-lg border">
      <ul className="divide-y px-4">
        {lines.map((line, index) => {
          const details = [line.variantLabel, ...line.optionLabels]
            .filter(Boolean)
            .join(' · ')
          return (
            <li key={index} className="flex justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {line.qty} × {line.productName}
                </p>
                {details && (
                  <p className="text-sm text-muted-foreground">{details}</p>
                )}
              </div>
              <span className="shrink-0 font-medium">
                {formatCurrency(line.lineTotal, currency)}
              </span>
            </li>
          )
        })}
      </ul>

      <dl className="space-y-1 border-t p-4 text-sm">
        {totals.discount > 0 && (
          <>
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(totals.subtotal, currency)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Promo por cantidad</dt>
              <dd>− {formatCurrency(totals.discount, currency)}</dd>
            </div>
          </>
        )}
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.total, currency)}</dd>
        </div>
      </dl>
    </div>
  )
}
