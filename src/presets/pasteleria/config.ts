import type { StoreConfig } from '@/types'

export const storeConfig: StoreConfig = {
  storeName: 'Pastelería Demo',
  tagline: 'Budines, tartas y dulces caseros',
  whatsappNumber: '5493704646563',
  currency: 'ARS',
  maxQtyPerLine: 10,
  deliveryMethods: [
    { id: 'pickup', label: 'Retiro en el local', requiresAddress: false },
    { id: 'delivery', label: 'Envío a domicilio', requiresAddress: true },
  ],
  messageStyle: {
    headerEmoji: '🧁',
    footerNote: 'Pago y horario a coordinar',
  },
  cardLook: 'cozy',
  scheduling: 'datetime',
  locationLink: true,
  images: {
    provider: 'imagekit',
    baseUrl: 'https://ik.imagekit.io/f9mtj7lc7',
  },
}
