import type { OptionGroup, Product } from '@/types'

export type Selection = Record<string, string[]>

// 'single' reemplaza la elección; 'multiple' alterna.
export function toggleChoice(
  group: OptionGroup,
  choiceId: string,
  current: string[] = [],
): string[] {
  if (group.type === 'single') return [choiceId]
  return current.includes(choiceId)
    ? current.filter((id) => id !== choiceId)
    : [...current, choiceId]
}

export function getMissingRequiredGroups(
  product: Product,
  selected: Selection,
): OptionGroup[] {
  return product.optionGroups.filter(
    (g) => g.required && (selected[g.id]?.length ?? 0) === 0,
  )
}

export function cleanSelection(selected: Selection): Selection {
  return Object.fromEntries(
    Object.entries(selected).filter(([, ids]) => ids.length > 0),
  )
}
