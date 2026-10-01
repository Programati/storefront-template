import type { Order } from './types'

// Pedido de ejemplo para los tests de la feature (la app no lo importa).
export const sampleOrder: Order = {
  code: 'TD-AB12',
  createdAt: '2026-10-03T15:00:00.000Z',
  customer: {
    name: 'Ana',
    deliveryLabel: 'Retiro en el local',
    notes: ['sin nueces', 'tocar timbre'],
  },
  schedule: { date: '2026-10-05', time: '16:00' },
  lines: [
    {
      productName: 'Producto Alfa',
      variantLabel: 'Grande',
      optionLabels: ['Agregado 1'],
      qty: 4,
      baseUnitPrice: 8500,
      unitPrice: 8000,
      lineTotal: 32000,
      lineSavings: 2000,
    },
    {
      productName: 'Producto Gamma',
      variantLabel: null,
      optionLabels: [],
      qty: 1,
      baseUnitPrice: 3000,
      unitPrice: 3000,
      lineTotal: 3000,
      lineSavings: 0,
    },
  ],
  totals: { subtotal: 37000, discount: 2000, total: 35000 },
}
