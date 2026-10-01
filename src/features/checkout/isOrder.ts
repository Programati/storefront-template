import type { Order } from './types'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null
const isNum = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v)

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false
  const { code, customer, schedule, lines, totals } = value
  if (typeof code !== 'string' || !isRecord(customer) || !isRecord(schedule))
    return false
  if (!Array.isArray(lines) || !isRecord(totals)) return false

  return (
    typeof customer.name === 'string' &&
    typeof customer.deliveryLabel === 'string' &&
    Array.isArray(customer.notes) &&
    isNum(totals.subtotal) &&
    isNum(totals.discount) &&
    isNum(totals.total) &&
    lines.every(
      (l) =>
        isRecord(l) &&
        typeof l.productName === 'string' &&
        Array.isArray(l.optionLabels) &&
        isNum(l.qty) &&
        isNum(l.baseUnitPrice) &&
        isNum(l.lineTotal) &&
        isNum(l.lineSavings),
    )
  )
}
