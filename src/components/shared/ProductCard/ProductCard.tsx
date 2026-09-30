import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/shared/SmartImage/SmartImage'
import { SoldOutOverlay } from '@/components/shared/SoldOutOverlay/SoldOutOverlay'
import { QuantityStepper } from '@/components/shared/QuantityStepper/QuantityStepper'
import { PriceTag } from '@/components/shared/PriceTag/PriceTag'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const cardVariants = cva('overflow-hidden transition-shadow', {
  variants: {
    look: {
      cozy: 'rounded-2xl border-2',
      catalog: 'rounded-lg',
      spec: 'rounded-none border-2 border-foreground/10',
    },
  },
  defaultVariants: { look: 'catalog' },
})

interface ProductCardProps extends VariantProps<typeof cardVariants> {
  product: Product
  currency: string
  maxQty: number
  onOpenOptions?: (product: Product) => void
  onAdd?: (product: Product, variantId: string, qty: number) => void
}

export function ProductCard({
  product,
  currency,
  maxQty,
  look,
  onOpenOptions,
  onAdd,
}: ProductCardProps) {
  const [qty, setQty] = useState(1)

  const hasOptions =
    product.variants.length > 1 || product.optionGroups.length > 0
  const lowestPrice = Math.min(...product.variants.map((v) => v.price))

  return (
    <Card
      className={cn(cardVariants({ look }), product.soldOut && 'opacity-90')}
    >
      <div
        className={cn('relative aspect-square', product.soldOut && 'grayscale')}
      >
        <SmartImage
          path={product.image.path}
          alt={product.image.alt}
          className="h-full w-full object-cover"
        />
        {product.soldOut && <SoldOutOverlay />}
      </div>

      <CardContent className="space-y-1 pt-4">
        <h3 className="leading-tight font-semibold">{product.name}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {product.description}
        </p>

        {product.details &&
          Object.values(product.details)
            .slice(0, 2)
            .map((value) => (
              <Badge key={value} variant="secondary" className="mr-1">
                {value}
              </Badge>
            ))}

        <PriceTag
          amount={lowestPrice}
          currency={currency}
          fromLabel={product.variants.length > 1}
          className="block pt-1 font-medium"
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        {product.soldOut ? (
          <Button disabled className="w-full">
            Agotado
          </Button>
        ) : hasOptions ? (
          <Button className="w-full" onClick={() => onOpenOptions?.(product)}>
            Elegir opciones
          </Button>
        ) : (
          <>
            <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
            <Button
              onClick={() => onAdd?.(product, product.variants[0].id, qty)}
            >
              Agregar
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
