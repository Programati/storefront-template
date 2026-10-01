import { useLocation } from 'react-router'
import { isOrder } from './isOrder'
import type { Order } from './types'

// El pedido recién enviado, tomado del estado del historial. null si no hay uno válido.
export function useLastOrder(): Order | null {
  const { state } = useLocation()
  const candidate = (state as { order?: unknown } | null)?.order
  return isOrder(candidate) ? candidate : null
}
