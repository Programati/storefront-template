import type { MessageStyle } from '@/types'
import type { Order } from './types'

export const DIVIDER = '━━━━━━━━━━'

interface MessageOptions {
  storeName: string
  style?: MessageStyle
  formatMoney: (amount: number) => string // inyectado: así el test no depende del idioma del sistema
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function buildWhatsAppMessage(
  order: Order,
  { storeName, style, formatMoney }: MessageOptions,
): string {
  const { customer, schedule, lines, totals } = order
  const out: string[] = []

  out.push(`${style?.headerEmoji ?? '🧾'} *NUEVO PEDIDO · ${storeName}*`)
  out.push(`Código: *${order.code}*`)
  out.push(DIVIDER)
  out.push(`👤 *Cliente:* ${customer.name}`)
  out.push(`📍 *Entrega:* ${customer.deliveryLabel}`)
  if (customer.address) out.push(`🏠 *Dirección:* ${customer.address}`)
  if (schedule.date) {
    out.push(
      `📅 *Para:* ${formatDate(schedule.date)}${schedule.time ? ` · ${schedule.time}` : ''}`,
    )
  }
  if (customer.notes.length > 0) {
    out.push('📝 *Notas:*')
    // Como cita: nada de lo que escriba el cliente puede parecer una línea del ticket.
    for (const note of customer.notes) out.push(`> ${note}`)
  }

  out.push('', '*Detalle*')
  lines.forEach((line, index) => {
    const variant = line.variantLabel ? ` (${line.variantLabel})` : ''
    out.push(`${index + 1}. ${line.qty} × ${line.productName}${variant}`)
    if (line.optionLabels.length > 0)
      out.push(`   ↳ ${line.optionLabels.join(' + ')}`)
    out.push(`   ${formatMoney(line.lineTotal)}`)
  })

  out.push(DIVIDER)
  if (totals.discount > 0) {
    out.push(`Subtotal: ${formatMoney(totals.subtotal)}`)
    out.push(`🎉 Promo por cantidad: -${formatMoney(totals.discount)}`)
  }
  out.push(`💰 *TOTAL: ${formatMoney(totals.total)}*`)
  if (style?.footerNote) out.push(`_${style.footerNote}_`)

  return out.join('\n')
}
