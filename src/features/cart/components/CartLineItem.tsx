import { Trash2 } from 'lucide-react'
import { QuantityStepper } from '@/components/shared/QuantityStepper/QuantityStepper'
import { SmartImage } from '@/components/shared/SmartImage/SmartImage'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format-currency'
import type { CartLineView } from '../cartView'

interface CartLineItemProps {
  view: CartLineView
  currency: string
  maxQty: number
  onQtyChange: (lineId: string, qty: number) => void
  onRemove: (lineId: string) => void
}

export function CartLineItem({
  view,
  currency,
  maxQty,
  onQtyChange,
  onRemove,
}: CartLineItemProps) {
  const details = [view.variantLabel, ...view.optionLabels]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="flex gap-3 py-4">
      <SmartImage
        path={view.image.path}
        alt={view.image.alt}
        width={128}
        height={128}
        className="size-16 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="leading-tight font-medium">{view.productName}</p>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-1 -mr-2 size-8"
            onClick={() => onRemove(view.lineId)}
            aria-label={`Quitar ${view.productName}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {details && <p className="text-sm text-muted-foreground">{details}</p>}
        <div className="flex items-center justify-between gap-2 pt-1">
          <QuantityStepper
            value={view.qty}
            onChange={(qty) => onQtyChange(view.lineId, qty)}
            max={maxQty}
          />
          <div className="text-right">
            {view.lineSavings > 0 && (
              <span className="block text-xs text-muted-foreground line-through">
                {formatCurrency(view.baseUnitPrice * view.qty, currency)}
              </span>
            )}
            <span className="font-medium">
              {formatCurrency(view.lineTotal, currency)}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}
