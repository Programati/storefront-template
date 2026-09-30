import { useCallback } from 'react'
import { useQueryPanel } from '@/hooks/useQueryPanel'

export function useCartPanel() {
  const { isOpen, open, close } = useQueryPanel('carrito')
  const openCart = useCallback(() => open('1'), [open])
  return { isOpen, open: openCart, close }
}
