import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { useCatalog, useStoreConfig } from '@/app/store'
import { priceCart } from '@/features/pricing'
import { CartContext, type CartContextValue } from './CartContext'
import { cartReducer, initialCartState } from './reducer'
import { sanitizeCartLines } from './sanitize'
import { loadCart, saveCart } from './storage'

export function CartProvider({ children }: { children: ReactNode }) {
  const config = useStoreConfig()
  const catalog = useCatalog()
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hidratar UNA sola vez al montar, ya saneado contra el catálogo actual.
  useEffect(() => {
    const stored = loadCart()
    const sanitized = sanitizeCartLines(
      stored,
      catalog.products,
      config.maxQtyPerLine,
    )
    if (sanitized.length > 0) {
      dispatch({ type: 'REPLACE', payload: { lines: sanitized } })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar, a propósito
  }, [])

  // Persistir en cada cambio, pero solo DESPUÉS de la hidratación: si
  // guardáramos desde el primer render (carrito todavía vacío), pisaríamos
  // el storage justo antes de que la hidratación tenga chance de aplicarse.
  useEffect(() => {
    if (!isHydrated) return
    saveCart(state.lines)
  }, [state.lines, isHydrated])

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
