import { describe, expect, it } from 'vitest'
import { cartReducer, initialCartState } from './reducer'

describe('cartReducer', () => {
  it('agrega una línea nueva', () => {
    const state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 2,
        maxQty: 100,
      },
    })
    expect(state.lines).toHaveLength(1)
    expect(state.lines[0]).toMatchObject({
      productId: 'p1',
      variantId: 'v1',
      qty: 2,
    })
  })

  it('fusiona cantidades si producto, variante y opciones coinciden', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: { extras: ['a'] },
        qty: 2,
        maxQty: 100,
      },
    })
    state = cartReducer(state, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: { extras: ['a'] },
        qty: 3,
        maxQty: 100,
      },
    })
    expect(state.lines).toHaveLength(1)
    expect(state.lines[0].qty).toBe(5)
  })

  it('crea una línea separada si las opciones elegidas son distintas', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: { extras: ['a'] },
        qty: 1,
        maxQty: 100,
      },
    })
    state = cartReducer(state, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: { extras: ['b'] },
        qty: 1,
        maxQty: 100,
      },
    })
    expect(state.lines).toHaveLength(2)
  })

  it('nunca supera el máximo configurado, ni sumando de a poco', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 95,
        maxQty: 100,
      },
    })
    state = cartReducer(state, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 20,
        maxQty: 100,
      },
    })
    expect(state.lines[0].qty).toBe(100)
  })

  it('nunca baja de 1, incluso con una cantidad inválida', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 1,
        maxQty: 100,
      },
    })
    const lineId = state.lines[0].lineId
    state = cartReducer(state, {
      type: 'SET_QTY',
      payload: { lineId, qty: Number.NaN, maxQty: 100 },
    })
    expect(state.lines[0].qty).toBe(1)
  })

  it('quita una línea', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 1,
        maxQty: 100,
      },
    })
    state = cartReducer(state, {
      type: 'REMOVE_LINE',
      payload: { lineId: state.lines[0].lineId },
    })
    expect(state.lines).toEqual([])
  })

  it('vacía el carrito', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 1,
        maxQty: 100,
      },
    })
    state = cartReducer(state, { type: 'CLEAR' })
    expect(state.lines).toEqual([])
  })

  it('trata un grupo vacío igual que un grupo ausente al fusionar líneas', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: {},
        qty: 1,
        maxQty: 100,
      },
    })
    state = cartReducer(state, {
      type: 'ADD_LINE',
      payload: {
        productId: 'p1',
        variantId: 'v1',
        selected: { extras: [] },
        qty: 1,
        maxQty: 100,
      },
    })
    expect(state.lines).toHaveLength(1)
    expect(state.lines[0].qty).toBe(2)
  })
})
