import { describe, expect, it } from 'vitest'
import { sampleOrder } from './orderFixture'
import { buildWhatsAppMessage, DIVIDER } from './whatsappMessage'

const options = {
  storeName: 'Tienda Demo',
  style: { footerNote: 'Pago y horario a coordinar' },
  formatMoney: (n: number) => `$${n}`,
}

describe('buildWhatsAppMessage', () => {
  it('arma el ticket completo', () => {
    expect(buildWhatsAppMessage(sampleOrder, options)).toBe(
      [
        '🧾 *NUEVO PEDIDO · Tienda Demo*',
        'Código: *TD-AB12*',
        DIVIDER,
        '👤 *Cliente:* Ana',
        '📍 *Entrega:* Retiro en el local',
        '📅 *Para:* 05/10/2026 · 16:00',
        '📝 *Notas:*',
        '> sin nueces',
        '> tocar timbre',
        '',
        '*Detalle*',
        '1) *4 ×* Producto Alfa (Grande)',
        '   ↳ Agregado 1',
        '   $32000',
        '2) *1 ×* Producto Gamma',
        '   $3000',
        DIVIDER,
        'Subtotal: $37000',
        '🎉 Promo por cantidad: -$2000',
        '💰 *TOTAL: $35000*',
        '_Pago y horario a coordinar_',
      ].join('\n'),
    )
  })

  it('omite subtotal y promo si no hay descuento', () => {
    const message = buildWhatsAppMessage(
      {
        ...sampleOrder,
        totals: { subtotal: 35000, discount: 0, total: 35000 },
      },
      options,
    )
    expect(message).not.toContain('Subtotal')
    expect(message).not.toContain('Promo')
  })

  it('omite fecha, dirección y notas si no hay', () => {
    const message = buildWhatsAppMessage(
      {
        ...sampleOrder,
        schedule: {},
        customer: { ...sampleOrder.customer, notes: [] },
      },
      options,
    )
    expect(message).not.toContain('Para:')
    expect(message).not.toContain('Notas')
    expect(message).not.toContain('Dirección')
  })

  it('distingue el número de ítem de la cantidad', () => {
    const lines = buildWhatsAppMessage(sampleOrder, options).split('\n')
    const items = lines.filter((line) => /^\d+\) /.test(line))
    expect(items.length).toBe(sampleOrder.lines.length)
    for (const item of items) expect(item).toMatch(/^\d+\) \*\d+ ×\* /)
  })
})
