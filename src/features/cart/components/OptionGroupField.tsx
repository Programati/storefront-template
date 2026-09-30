import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/format-currency'
import type { Choice, OptionGroup } from '@/types'

interface OptionGroupFieldProps {
  group: OptionGroup
  selectedIds: string[]
  onToggle: (choiceId: string) => void
  currency: string
}

const rowClass =
  'flex cursor-pointer items-center gap-3 rounded-md border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'

function ChoiceExtra({
  choice,
  currency,
}: {
  choice: Choice
  currency: string
}) {
  if (!choice.priceDelta) return null
  return (
    <span className="text-muted-foreground">
      + {formatCurrency(choice.priceDelta, currency)}
    </span>
  )
}

export function OptionGroupField({
  group,
  selectedIds,
  onToggle,
  currency,
}: OptionGroupFieldProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        {group.label}
        {group.required && <span className="text-destructive"> *</span>}
      </legend>

      {group.type === 'single' ? (
        <RadioGroup
          value={selectedIds[0] ?? ''}
          onValueChange={onToggle}
          className="gap-2"
        >
          {group.choices.map((choice) => (
            <Label
              key={choice.id}
              htmlFor={`${group.id}-${choice.id}`}
              className={rowClass}
            >
              <RadioGroupItem
                id={`${group.id}-${choice.id}`}
                value={choice.id}
              />
              <span className="flex-1">{choice.label}</span>
              <ChoiceExtra choice={choice} currency={currency} />
            </Label>
          ))}
        </RadioGroup>
      ) : (
        <div className="grid gap-2">
          {group.choices.map((choice) => (
            <Label
              key={choice.id}
              htmlFor={`${group.id}-${choice.id}`}
              className={rowClass}
            >
              <Checkbox
                id={`${group.id}-${choice.id}`}
                checked={selectedIds.includes(choice.id)}
                onCheckedChange={() => onToggle(choice.id)}
              />
              <span className="flex-1">{choice.label}</span>
              <ChoiceExtra choice={choice} currency={currency} />
            </Label>
          ))}
        </div>
      )}
    </fieldset>
  )
}
