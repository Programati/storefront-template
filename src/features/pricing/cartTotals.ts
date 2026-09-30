import type { CartTotals, PricedLine } from './types'

export function cartTotals(lines: PricedLine[]): CartTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.baseUnitPrice * l.qty, 0)
  const discount = lines.reduce((sum, l) => sum + l.lineSavings, 0)
  return { subtotal, discount, total: subtotal - discount }
}
