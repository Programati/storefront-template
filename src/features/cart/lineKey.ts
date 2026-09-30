import type { CartLine } from '@/types'

// Identifica líneas "equivalentes": mismo producto, misma variante y mismas
// opciones elegidas — sin importar el orden en que se marcaron.
export function lineKey(
  productId: string,
  variantId: string,
  selected: Record<string, string[]>,
): string {
  const normalized = Object.keys(selected)
    .filter((groupId) => selected[groupId].length > 0)
    .sort()
    .map((groupId) => `${groupId}:${[...selected[groupId]].sort().join(',')}`)
    .join('|')
  return `${productId}::${variantId}::${normalized}`
}

export function lineMatchesKey(line: CartLine, key: string): boolean {
  return lineKey(line.productId, line.variantId, line.selected) === key
}
