// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import type { CartLine } from '@/types'
import { CART_STORAGE_KEY, loadCart, saveCart } from './storage'

const sampleLine: CartLine = {
  lineId: 'l1',
  productId: 'p1',
  variantId: 'v1',
  selected: {},
  qty: 2,
}

describe('cart storage', () => {
  beforeEach(() => window.localStorage.clear())

  it('devuelve carrito vacío si no hay nada guardado', () => {
    expect(loadCart()).toEqual([])
  })

  it('guarda y recupera líneas válidas', () => {
    saveCart([sampleLine])
    expect(loadCart()).toEqual([sampleLine])
  })

  it('ignora JSON corrupto sin explotar', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{not valid json')
    expect(loadCart()).toEqual([])
  })

  it('ignora una versión de storage distinta', () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: 99, lines: [sampleLine] }),
    )
    expect(loadCart()).toEqual([])
  })

  it('descarta líneas con forma inválida', () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: 1, lines: [{ lineId: 'x' }] }),
    )
    expect(loadCart()).toEqual([])
  })
})
