export type SocialNetwork = 'instagram' | 'facebook'

const HOSTS: Record<SocialNetwork, readonly string[]> = {
  instagram: ['instagram.com', 'www.instagram.com'],
  facebook: ['facebook.com', 'www.facebook.com', 'm.facebook.com'],
}

const MAX_LENGTH = 200

/**
 * Devuelve la URL normalizada si es un link https de esa red con un perfil o
 * página (ruta no vacía); si no, null. Host exacto: nunca "contiene".
 */
export function parseSocialLink(
  network: SocialNetwork,
  input: string,
): string | null {
  const raw = input.trim()
  if (!raw || raw.length > MAX_LENGTH || /\s/.test(raw)) return null

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  if (url.protocol !== 'https:') return null
  if (url.username || url.password || url.port) return null
  if (!HOSTS[network].includes(url.hostname.toLowerCase())) return null
  if (url.pathname === '/' || url.pathname === '') return null

  return url.href
}
