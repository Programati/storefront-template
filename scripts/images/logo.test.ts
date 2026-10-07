import { describe, expect, it } from 'vitest'
import { fitInside } from './logo'

describe('fitInside', () => {
  it('no agranda una imagen que ya entra', () => {
    expect(fitInside(150, 150, 640, 160)).toEqual({ width: 150, height: 150 })
  })

  it('reduce por el alto manteniendo la proporción', () => {
    expect(fitInside(800, 400, 640, 160)).toEqual({ width: 320, height: 160 })
  })

  it('reduce por el ancho cuando es lo que más sobra', () => {
    expect(fitInside(1600, 100, 640, 160)).toEqual({ width: 640, height: 40 })
  })
})
