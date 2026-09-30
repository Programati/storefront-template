import { useStoreConfig } from '@/app/store'
import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { QuantityStepper } from '@/components/shared/QuantityStepper/QuantityStepper'
import { SmartImage } from '@/components/shared/SmartImage/SmartImage'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format-currency'
import type { Product } from '@/types'
import { useAddToCart } from '../useAddToCart'
import { useProductSelection } from '../useProductSelection'
import { OptionGroupField } from './OptionGroupField'
import { VariantField } from './VariantField'

interface ProductOptionsFormProps {
  product: Product
  onAdded: () => void
}

export function ProductOptionsForm({
  product,
  onAdded,
}: ProductOptionsFormProps) {
  const config = useStoreConfig()
  const sel = useProductSelection(product)
  const addToCart = useAddToCart()

  if (product.soldOut) {
    return (
      <div className="p-4">
        <EmptyState
          title="Producto agotado"
          description="Por ahora no podemos tomar pedidos de este producto."
        />
      </div>
    )
  }

  function handleSubmit() {
    if (!sel.isValid) return
    addToCart(product, {
      variantId: sel.variantId,
      selected: sel.cleanedSelection,
      qty: sel.qty,
    })
    onAdded()
  }

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <SmartImage
          path={product.image.path}
          alt={product.image.alt}
          width={640}
          height={360}
          className="aspect-video w-full rounded-lg object-cover"
        />

        {product.variants.length > 1 && (
          <VariantField
            label={product.variantLabel ?? 'Opción'}
            variants={product.variants}
            value={sel.variantId}
            onChange={sel.setVariantId}
            currency={config.currency}
          />
        )}

        {product.optionGroups.map((group) => (
          <OptionGroupField
            key={group.id}
            group={group}
            selectedIds={sel.selected[group.id] ?? []}
            onToggle={(choiceId) => sel.toggle(group, choiceId)}
            currency={config.currency}
          />
        ))}

        <div className="space-y-2">
          <p className="text-sm font-medium">Cantidad</p>
          <QuantityStepper
            value={sel.qty}
            onChange={sel.setQty}
            max={sel.maxQty}
          />
          {sel.qty >= sel.maxQty && (
            <p className="text-xs text-muted-foreground">
              Máximo {sel.maxQty} por producto. ¿Necesitás más?{' '}
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Escribinos
              </a>
              .
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!sel.isValid && (
          <p className="text-sm text-destructive">
            Falta elegir: {sel.missing.map((g) => g.label).join(', ')}
          </p>
        )}
        <Button
          className="w-full"
          size="lg"
          disabled={!sel.isValid}
          onClick={handleSubmit}
        >
          Agregar · {formatCurrency(sel.preview.lineTotal, config.currency)}
        </Button>
        {sel.preview.lineSavings > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Incluye promo por cantidad: ahorrás{' '}
            {formatCurrency(sel.preview.lineSavings, config.currency)}
          </p>
        )}
      </div>
    </>
  )
}
