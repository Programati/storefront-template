import type { CartLine } from '@/types'

export const CART_STORAGE_KEY = 'cart:v1' // el número de versión viaja en la propia key
const MAX_STORAGE_CHARS = 100_000 // guardarraíl: localStorage no es una base de datos

interface StoredCart {
  version: 1
  lines: CartLine[]
}

function isValidLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false
  const l = value as Record<string, unknown>
  return (
    typeof l.lineId === 'string' &&
    typeof l.productId === 'string' &&
    typeof l.variantId === 'string' &&
    typeof l.qty === 'number' &&
    Number.isFinite(l.qty) &&
    typeof l.selected === 'object' &&
    l.selected !== null
  )
}

export function loadCart(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<StoredCart>
    if (parsed.version !== 1 || !Array.isArray(parsed.lines)) return []
    return parsed.lines.filter(isValidLine)
  } catch {
    // JSON corrupto, modo privado sin storage, etc: arrancamos en blanco
    return []
  }
}

export function saveCart(lines: CartLine[]): void {
  if (typeof window === 'undefined') return
  try {
    const serialized = JSON.stringify({
      version: 1,
      lines,
    } satisfies StoredCart)
    if (serialized.length > MAX_STORAGE_CHARS) return
    window.localStorage.setItem(CART_STORAGE_KEY, serialized)
  } catch {
    // cuota excedida u otro error: el carrito sigue andando en memoria igual
  }
}
