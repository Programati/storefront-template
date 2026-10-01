// Umbral conservador sobre el texto YA codificado. No encontré un límite
// documentado para el parámetro `text` de wa.me: si en pruebas reales con
// pedidos largos funciona con más, se puede subir.
export const MAX_ENCODED_TEXT_LENGTH = 2000

export interface WhatsAppLink {
  url: string
  includesMessage: boolean // false → se abre el chat vacío y el cliente tiene que pegar el mensaje
}

export function buildWhatsAppUrl(
  phone: string,
  message: string,
  maxEncodedLength = MAX_ENCODED_TEXT_LENGTH,
): WhatsAppLink {
  const base = `https://wa.me/${phone.replace(/\D/g, '')}` // solo dígitos: wa.me no admite '+', espacios ni guiones
  const text = encodeURIComponent(message)
  if (text.length > maxEncodedLength)
    return { url: base, includesMessage: false }
  return { url: `${base}?text=${text}`, includesMessage: true }
}
