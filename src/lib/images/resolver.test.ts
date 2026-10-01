import { describe, expect, it } from 'vitest'
import { createImageResolver } from './resolver'

describe('createImageResolver', () => {
  const resolve = createImageResolver({
    provider: 'imagekit',
    baseUrl: 'https://ik.imagekit.io/demo',
  })

  it('src usa el ancho por defecto (640)', () => {
    expect(resolve('products/alfa.webp').src).toContain('tr=w-640,')
  })

  it('srcSet lista todos los anchos con su descriptor', () => {
    const { srcSet } = resolve('products/alfa.webp')
    expect(srcSet.split(', ')).toHaveLength(5)
    expect(srcSet).toContain('tr=w-320,q-80,f-auto 320w')
    expect(srcSet).toContain('tr=w-1280,q-80,f-auto 1280w')
  })

  it('permite anchos y calidad personalizados', () => {
    const { srcSet } = resolve('products/alfa.webp', {
      widths: [200, 400],
      quality: 70,
    })
    expect(srcSet).toBe(
      'https://ik.imagekit.io/demo/products/alfa.webp?tr=w-200,q-70,f-auto 200w, ' +
        'https://ik.imagekit.io/demo/products/alfa.webp?tr=w-400,q-70,f-auto 400w',
    )
  })

  it('sin config cae al placeholder de desarrollo', () => {
    const { src } = createImageResolver()('products/alfa.webp')
    expect(src).toContain('placehold.co')
  })
})
