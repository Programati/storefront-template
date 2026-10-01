import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from './whatsappUrl'

describe('buildWhatsAppUrl', () => {
  it('limpia el número y codifica el texto', () => {
    expect(
      buildWhatsAppUrl('+54 9 379 400-0000', 'Hola *mundo*\n1 × a'),
    ).toEqual({
      url: 'https://wa.me/5493794000000?text=Hola%20*mundo*%0A1%20%C3%97%20a',
      includesMessage: true,
    })
  })

  it('si el texto es demasiado largo, abre el chat sin texto', () => {
    expect(buildWhatsAppUrl('5493794000000', 'x'.repeat(50), 10)).toEqual({
      url: 'https://wa.me/5493794000000',
      includesMessage: false,
    })
  })
})
