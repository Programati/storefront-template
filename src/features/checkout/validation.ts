import type { DeliveryMethod } from '@/types'
import { sanitizeInline } from './sanitize'
import type { CheckoutErrors, CheckoutField, CheckoutFormValues } from './types'

// También se usan como `maxLength` de los inputs: una sola fuente para ambos.
export const LIMITS = { name: 60, address: 120, notes: 300 } as const

// Orden en que se muestran los campos: el primero inválido recibe el foco.
export const FIELD_ORDER: CheckoutField[] = [
  'name',
  'deliveryMethodId',
  'address',
  'date',
  'time',
  'notes',
]

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

// Fecha de HOY en el huso del dispositivo. toISOString() daría la fecha en UTC
// y, de noche en Argentina, ya marcaría "mañana".
export function todayLocalISO(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function validateCheckout(
  values: CheckoutFormValues,
  methods: DeliveryMethod[],
  today: string,
): CheckoutErrors {
  const errors: CheckoutErrors = {}

  // Se valida el texto YA saneado: un nombre como "**" no cuenta como nombre.
  if (sanitizeInline(values.name, LIMITS.name).length < 2) {
    errors.name = 'Ingresá tu nombre.'
  }

  const method = methods.find((m) => m.id === values.deliveryMethodId)
  if (!method) {
    errors.deliveryMethodId = 'Elegí cómo querés recibir tu pedido.'
  } else if (
    method.requiresAddress &&
    sanitizeInline(values.address, LIMITS.address).length < 5
  ) {
    errors.address = 'Ingresá la dirección de entrega.'
  }

  if (values.date) {
    if (!DATE_RE.test(values.date)) errors.date = 'La fecha no es válida.'
    else if (values.date < today)
      errors.date = 'La fecha no puede ser anterior a hoy.' // ISO: se compara como texto
  }

  if (values.time) {
    if (!TIME_RE.test(values.time)) errors.time = 'El horario no es válido.'
    else if (!values.date) errors.time = 'Elegí también la fecha.'
  }

  return errors
}
