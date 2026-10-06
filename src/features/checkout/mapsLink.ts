/** Largo máximo del link pegado (también se usa como `maxLength` del input). */
export const MAPS_URL_MAX = 300

/**
 * Devuelve la URL normalizada si es un link de Google Maps válido; si no, null.
 * Solo https, sin credenciales ni puerto, y con host exacto (nunca "contiene").
 */
export function parseMapsLink(input: string): string | null {
  const raw = input.trim()
  if (!raw || raw.length > MAPS_URL_MAX || /\s/.test(raw)) return null

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  if (url.protocol !== 'https:') return null
  if (url.username || url.password || url.port) return null

  const host = url.hostname.toLowerCase()
  const path = url.pathname
  const underMaps = path === '/maps' || path.startsWith('/maps/')

  const allowed =
    host === 'maps.app.goo.gl' ||
    host === 'maps.google.com' ||
    ((host === 'google.com' ||
      host === 'www.google.com' ||
      host === 'goo.gl') &&
      underMaps)

  return allowed ? url.href : null
}
