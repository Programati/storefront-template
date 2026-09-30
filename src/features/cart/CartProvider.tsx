import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { useCatalog, useStoreConfig } from '@/app/store'
import { priceCart } from '@/features/pricing'
import { CartContext, type CartContextValue } from './CartContext'
import { cartReducer, initialCartState } from './reducer'
import { sanitizeCartLines } from './sanitize'
import { loadCart, saveCart } from './storage'

export function CartProvider({ children }: { children: ReactNode }) {
  const config = useStoreConfig()
  const catalog = useCatalog()

  // El inicializador corre una sola vez, al montar: el carrito nace ya
  // hidratado y saneado contra el catálogo vigente, sin render intermedio vacío.
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () => ({
    lines: sanitizeCartLines(
      loadCart(),
      catalog.products,
      config.maxQtyPerLine,
    ),
  }))

  // Este sí es un uso legítimo de un efecto: sincronizar el estado de React
  // con un sistema externo (localStorage). No llama a ningún setState.
  useEffect(() => {
    saveCart(state.lines)
  }, [state.lines])

  const { lines: pricedLines, totals } = useMemo(
    () => priceCart(state.lines, catalog.products, catalog.pricingRules),
    [state.lines, catalog.products, catalog.pricingRules],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      pricedLines,
      totals,
      isEmpty: state.lines.length === 0,
      addLine: ({ productId, variantId, selected = {}, qty = 1 }) =>
        dispatch({
          type: 'ADD_LINE',
          payload: {
            productId,
            variantId,
            selected,
            qty,
            maxQty: config.maxQtyPerLine,
          },
        }),
      setQty: (lineId, qty) =>
        dispatch({
          type: 'SET_QTY',
          payload: { lineId, qty, maxQty: config.maxQtyPerLine },
        }),
      removeLine: (lineId) =>
        dispatch({ type: 'REMOVE_LINE', payload: { lineId } }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.lines, pricedLines, totals, config.maxQtyPerLine],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
