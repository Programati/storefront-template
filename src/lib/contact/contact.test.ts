import { describe, expect, it } from 'vitest'
import { displayPhone, internationalPhone, whatsappChatUrl } from './contact'

describe('whatsappChatUrl', () => {
  it('arma el link con solo los dígitos', () => {
    expect(whatsappChatUrl('+54 9 3794-572993')).toBe(
      'https://wa.me/5493794572993',
    )
  })

  it('sin dígitos devuelve null', () => {
    expect(whatsappChatUrl('abc')).toBeNull()
  })
})

describe('internationalPhone', () => {
  it('antepone + a los dígitos', () => {
    expect(internationalPhone('5493794572993')).toBe('+5493794572993')
  })

  it('sin dígitos devuelve texto vacío', () => {
    expect(internationalPhone('')).toBe('')
  })
})

describe('displayPhone', () => {
  it('celular argentino: +54 9 y el resto', () => {
    expect(displayPhone('5493794572993')).toBe('+54 9 3794572993')
  })

  it('otro formato: + y los dígitos', () => {
    expect(displayPhone('+1 (555) 010-9999')).toBe('+15550109999')
  })

  it('sin dígitos devuelve texto vacío', () => {
    expect(displayPhone('')).toBe('')
  })
})
