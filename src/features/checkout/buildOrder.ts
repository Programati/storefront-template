import type { CartLineView } from '@/features/cart'
import type { CartTotals } from '@/features/pricing'
import type { DeliveryMethod } from '@/types'
import { makeOrderCode } from './orderCode'
import { parseMapsLink } from './mapsLink'
import { sanitizeInline, sanitizeNotes } from './sanitize'
import type {
  CheckoutFormValues,
  Order,
  OrderLine,
  OrderSchedule,
} from './types'
import { LIMITS } from './validation'

export function toOrderLines(views: CartLineView[]): OrderLine[] {
  return views.map((v) => ({
    productName: v.productName,
    variantLabel: v.variantLabel,
    optionLabels: v.optionLabels,
    qty: v.qty,
    baseUnitPrice: v.baseUnitPrice,
    unitPrice: v.unitPrice,
    lineTotal: v.lineTotal,
    lineSavings: v.lineSavings,
  }))
}

interface BuildOrderInput {
  values: CheckoutFormValues
  views: CartLineView[]
  totals: CartTotals
  deliveryMethods: DeliveryMethod[]
  storeName: string
  now?: Date // inyectables para testear
  code?: string
}

export function buildOrder({
  values,
  views,
  totals,
  deliveryMethods,
  storeName,
  now = new Date(),
  code,
}: BuildOrderInput): Order {
  const method = deliveryMethods.find((m) => m.id === values.deliveryMethodId)
  if (!method)
    throw new Error(
      `Método de entrega "${values.deliveryMethodId}" inexistente`,
    )

  // Un valor viejo en un campo oculto (ej: dirección tras cambiar a "retiro") no viaja.
  const address = method.requiresAddress
    ? sanitizeInline(values.address, LIMITS.address)
    : ''

  // Mismo criterio que la dirección: solo viaja si la entrega la requiere,
  // y se guarda la URL ya normalizada y validada.
  const locationUrl =
    method.requiresAddress && values.locationUrl
      ? parseMapsLink(values.locationUrl)
      : null

  const schedule: OrderSchedule = {}
  if (values.date) {
    schedule.date = values.date
    if (values.time) schedule.time = values.time
  }

  return {
    code: code ?? makeOrderCode(storeName),
    createdAt: now.toISOString(),
    customer: {
      name: sanitizeInline(values.name, LIMITS.name),
      deliveryLabel: method.label,
      ...(address ? { address } : {}),
      ...(locationUrl ? { locationUrl } : {}),
      notes: sanitizeNotes(values.notes, LIMITS.notes),
    },
    schedule,
    lines: toOrderLines(views),
    totals,
  }
}
