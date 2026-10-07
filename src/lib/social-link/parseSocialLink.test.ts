import { describe, expect, it } from 'vitest'
import { parseSocialLink } from './parseSocialLink'

describe('parseSocialLink', () => {
  it.each([
    ['instagram', 'https://www.instagram.com/dulceolivia_okk/'],
    ['instagram', 'https://instagram.com/mi_tienda'],
    ['facebook', 'https://www.facebook.com/mi.tienda'],
    ['facebook', 'https://m.facebook.com/mitienda'],
  ] as const)('acepta %s: %s', (network, link) => {
    expect(parseSocialLink(network, link)).not.toBeNull()
  })

  it('recorta espacios alrededor', () => {
    expect(
      parseSocialLink('instagram', '  https://instagram.com/tienda  '),
    ).toBe('https://instagram.com/tienda')
  })

  it.each([
    ['vacío', 'instagram', ''],
    ['texto suelto', 'instagram', '@mi_tienda'],
    ['javascript:', 'instagram', 'javascript:alert(1)'],
    ['http sin TLS', 'instagram', 'http://instagram.com/tienda'],
    ['red equivocada', 'facebook', 'https://instagram.com/tienda'],
    ['host que empieza igual', 'instagram', 'https://instagram.com.evil.com/a'],
    ['credenciales', 'instagram', 'https://instagram.com@evil.com/a'],
    ['con puerto', 'facebook', 'https://facebook.com:8443/tienda'],
    ['sin perfil', 'instagram', 'https://instagram.com/'],
    ['espacios en el medio', 'facebook', 'https://facebook.com/a b'],
  ] as const)('rechaza: %s', (_label, network, link) => {
    expect(parseSocialLink(network, link)).toBeNull()
  })
})
