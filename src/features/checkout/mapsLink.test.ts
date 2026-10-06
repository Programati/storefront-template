import { describe, expect, it } from 'vitest'
import { parseMapsLink } from './mapsLink'

describe('parseMapsLink', () => {
  it.each([
    'https://maps.app.goo.gl/AbC123xyz',
    'https://maps.google.com/?q=-27.46,-58.83',
    'https://www.google.com/maps/place/Corrientes',
    'https://google.com/maps?q=obelisco',
    'https://goo.gl/maps/AbC123',
  ])('acepta %s', (link) => {
    expect(parseMapsLink(link)).not.toBeNull()
  })

  it('recorta espacios alrededor', () => {
    expect(parseMapsLink('  https://maps.app.goo.gl/AbC123  ')).toBe(
      'https://maps.app.goo.gl/AbC123',
    )
  })

  it.each([
    ['vacío', ''],
    ['solo espacios', '   '],
    ['texto suelto', 'calle falsa 123'],
    ['javascript:', 'javascript:alert(1)'],
    ['http sin TLS', 'http://maps.google.com/?q=a'],
    ['otro dominio', 'https://example.com/maps/a'],
    ['dominio que empieza igual', 'https://maps.google.com.evil.com/a'],
    ['google.com.evil.com', 'https://google.com.evil.com/maps/a'],
    ['credenciales', 'https://maps.google.com@evil.com/a'],
    ['con usuario', 'https://user:pass@maps.google.com/a'],
    ['con puerto', 'https://maps.google.com:8443/a'],
    ['google.com fuera de /maps', 'https://www.google.com/search?q=a'],
    ['prefijo parecido a /maps', 'https://www.google.com/mapsx'],
    ['espacios en el medio', 'https://maps.google.com/a b'],
  ])('rechaza: %s', (_label, link) => {
    expect(parseMapsLink(link)).toBeNull()
  })

  it('rechaza links demasiado largos', () => {
    expect(
      parseMapsLink(`https://maps.google.com/?q=${'a'.repeat(300)}`),
    ).toBeNull()
  })
})
