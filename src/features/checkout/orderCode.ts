import { normalizeText } from '@/lib/normalize-text'

// 32 símbolos, sin I, O, 0 ni 1: no se confunden cuando alguien los lee o los dicta.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 4

// 'Dulce Olivia' → 'DO'. Sale del nombre de la tienda: no hay nada más que configurar.
export function orderPrefix(storeName: string): string {
  const initials = normalizeText(storeName)
    .split(/\s+/)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
  return initials || 'PED'
}

function secureRandomInt(max: number): number {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return buffer[0] % max // 2^32 es múltiplo de 32: no hay sesgo
}

// `randomInt` se inyecta para poder testear con valores fijos.
export function makeOrderCode(
  storeName: string,
  randomInt: (max: number) => number = secureRandomInt,
): string {
  const suffix = Array.from(
    { length: CODE_LENGTH },
    () => ALPHABET[randomInt(ALPHABET.length)],
  ).join('')
  return `${orderPrefix(storeName)}-${suffix}`
}
