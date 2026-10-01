import type { CartLineView } from '@/features/cart'
import type { CartTotals } from '@/features/pricing'

// Lo que se guarda de cada línea: sin imágenes ni ids, solo lo que se muestra o se envía.
export type OrderLine = Pick<
  CartLineView,
  | 'productName'
  | 'variantLabel'
  | 'optionLabels'
  | 'qty'
  | 'baseUnitPrice'
  | 'unitPrice'
  | 'lineTotal'
  | 'lineSavings'
>

export interface OrderCustomer {
  name: string
  deliveryLabel: string // el texto del método, ya resuelto: el pedido no depende de la config
  address?: string
  notes: string[] // una entrada por línea, ya saneadas
}

export interface OrderSchedule {
  date?: string // 'YYYY-MM-DD'
  time?: string // 'HH:mm'
}

export interface Order {
  code: string
  createdAt: string // ISO
  customer: OrderCustomer
  schedule: OrderSchedule
  lines: OrderLine[]
  totals: CartTotals
}

export interface CheckoutFormValues {
  name: string
  deliveryMethodId: string
  address: string
  date: string
  time: string
  notes: string
}

export type CheckoutField = keyof CheckoutFormValues
export type CheckoutErrors = Partial<Record<CheckoutField, string>>
