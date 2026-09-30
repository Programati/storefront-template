import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/format-currency'
import type { Variant } from '@/types'

interface VariantFieldProps {
  label: string
  variants: Variant[]
  value: string
  onChange: (variantId: string) => void
  currency: string
}

export function VariantField({
  label,
  variants,
  value,
  onChange,
  currency,
}: VariantFieldProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <RadioGroup value={value} onValueChange={onChange} className="gap-2">
        {variants.map((variant) => (
          <Label
            key={variant.id}
            htmlFor={`variant-${variant.id}`}
            className="flex cursor-pointer items-center gap-3 rounded-md border p-3 font-normal has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
          >
            <RadioGroupItem id={`variant-${variant.id}`} value={variant.id} />
            <span className="flex-1">{variant.label}</span>
            <span className="text-muted-foreground">
              {formatCurrency(variant.price, currency)}
            </span>
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}
