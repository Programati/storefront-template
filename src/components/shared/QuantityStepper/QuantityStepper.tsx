import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QuantityStepperProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max: number
  disabled?: boolean
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled,
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  function handleInputChange(raw: string) {
    if (raw === '') return
    const parsed = Number(raw.replace(/[^0-9]/g, ''))
    if (Number.isNaN(parsed)) return
    onChange(clamp(parsed))
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        aria-label="Restar cantidad"
      >
        <Minus className="size-4" />
      </Button>
      <Input
        inputMode="numeric"
        value={value}
        disabled={disabled}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-14 text-center"
        aria-label="Cantidad"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        aria-label="Sumar cantidad"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}
