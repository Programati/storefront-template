import type { StoreConfig } from '@/types'

export const storeConfig: StoreConfig = {
  storeName: 'Tienda Demo',
  tagline: 'Catálogo de ejemplo para probar el core',
  whatsappNumber: '5493794646563',
  currency: 'ARS',
  maxQtyPerLine: 10,
  deliveryMethods: [
    { id: 'pickup', label: 'Retiro en el local', requiresAddress: false },
    { id: 'delivery', label: 'Envío a domicilio', requiresAddress: true },
  ],
  messageStyle: {
    headerEmoji: '🧾',
    footerNote: 'Pago y horario a coordinar',
  },
  cardLook: 'catalog',
}
