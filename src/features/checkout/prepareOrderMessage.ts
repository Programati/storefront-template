import type { StoreConfig } from '@/types'
import { formatCurrency } from '@/lib/format-currency'
import type { Order } from './types'
import { buildWhatsAppMessage } from './whatsappMessage'
import { buildWhatsAppUrl, type WhatsAppLink } from './whatsappUrl'

export function prepareOrderMessage(
  order: Order,
  config: StoreConfig,
): WhatsAppLink & { message: string } {
  const message = buildWhatsAppMessage(order, {
    storeName: config.storeName,
    style: config.messageStyle,
    formatMoney: (amount) => formatCurrency(amount, config.currency),
  })
  return { message, ...buildWhatsAppUrl(config.whatsappNumber, message) }
}
