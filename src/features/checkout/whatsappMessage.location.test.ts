import { describe, expect, it } from 'vitest'
import { sampleOrder } from './orderFixture'
import type { Order } from './types'
import { buildWhatsAppMessage } from './whatsappMessage'

const options = { storeName: 'Tienda', formatMoney: (n: number) => `$${n}` }

const withLocation: Order = {
  ...sampleOrder,
  customer: {
    ...sampleOrder.customer,
    address: 'Calle 123',
    locationUrl: 'https://maps.app.goo.gl/AbC123',
  },
}

describe('buildWhatsAppMessage: ubicación', () => {
  it('agrega la línea de ubicación debajo de la dirección', () => {
    const lines = buildWhatsAppMessage(withLocation, options).split('\n')
    const address = lines.findIndex((l) => l.includes('Dirección'))
    expect(lines[address + 1]).toBe(
      '🗺️ *Ubicación:* https://maps.app.goo.gl/AbC123',
    )
  })

  it('sin link no agrega la línea', () => {
    expect(buildWhatsAppMessage(sampleOrder, options)).not.toContain(
      'Ubicación',
    )
  })
})
