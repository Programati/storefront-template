import { lineKey } from './lineKey'
import type { CartAction, CartState } from './types'

export const initialCartState: CartState = { lines: [] }

function clampQty(qty: number, maxQty: number): number {
  const safe = Number.isFinite(qty) ? Math.round(qty) : 1
  return Math.min(maxQty, Math.max(1, safe))
}

let lineCounter = 0
function createLineId(): string {
  lineCounter += 1
  return `line-${Date.now()}-${lineCounter}`
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_LINE': {
      const { productId, variantId, selected, qty, maxQty } = action.payload
      const key = lineKey(productId, variantId, selected)
      const existing = state.lines.find(
        (l) => lineKey(l.productId, l.variantId, l.selected) === key,
      )

      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.lineId === existing.lineId
              ? { ...l, qty: clampQty(l.qty + qty, maxQty) }
              : l,
          ),
        }
      }

      return {
        lines: [
          ...state.lines,
          {
            lineId: createLineId(),
            productId,
            variantId,
            selected,
            qty: clampQty(qty, maxQty),
          },
        ],
      }
    }

    case 'SET_QTY': {
      const { lineId, qty, maxQty } = action.payload
      return {
        lines: state.lines.map((l) =>
          l.lineId === lineId ? { ...l, qty: clampQty(qty, maxQty) } : l,
        ),
      }
    }

    case 'REMOVE_LINE':
      return {
        lines: state.lines.filter((l) => l.lineId !== action.payload.lineId),
      }

    case 'CLEAR':
      return { lines: [] }

    case 'REPLACE':
      return { lines: action.payload.lines }

    default:
      return state
  }
}
