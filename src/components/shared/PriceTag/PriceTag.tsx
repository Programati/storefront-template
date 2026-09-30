import { formatCurrency } from '@/lib/format-currency'

interface PriceTagProps {
  amount: number
  currency: string
  fromLabel?: boolean // true → "Desde $X" (cuando el producto tiene más de un precio posible)
  className?: string
}

export function PriceTag({
  amount,
  currency,
  fromLabel = false,
  className,
}: PriceTagProps) {
  const formatted = formatCurrency(amount, currency)
  return (
    <span className={className}>
      {fromLabel ? `Desde ${formatted}` : formatted}
    </span>
  )
}
