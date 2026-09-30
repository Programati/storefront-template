import type { Product } from '@/types'

export function getExtrasUnitDelta(
  product: Product,
  selected: Record<string, string[]>,
): number {
  return product.optionGroups.reduce((sum, group) => {
    const selectedIds = selected[group.id] ?? []
    const groupDelta = group.choices
      .filter((choice) => selectedIds.includes(choice.id))
      .reduce((s, choice) => s + (choice.priceDelta ?? 0), 0)
    return sum + groupDelta
  }, 0)
}
