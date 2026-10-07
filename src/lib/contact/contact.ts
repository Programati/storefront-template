const digitsOf = (phone: string) => phone.replace(/\D/g, '')

/** Chat de WhatsApp sin texto. null si el número no tiene dígitos. */
export function whatsappChatUrl(phone: string): string | null {
  const digits = digitsOf(phone)
  return digits ? `https://wa.me/${digits}` : null
}

/** Número en formato internacional ('+' y dígitos): lo que se copia. */
export function internationalPhone(phone: string): string {
  const digits = digitsOf(phone)
  return digits ? `+${digits}` : ''
}

/**
 * Lo que se muestra. Celular argentino (54 + 9 + 10 dígitos): '+54 9 ' y el
 * resto, porque el largo del código de área varía y no se puede separar sin
 * una tabla. Cualquier otro número: '+' y los dígitos.
 */
export function displayPhone(phone: string): string {
  const digits = digitsOf(phone)
  const argentine = /^549(\d{10})$/.exec(digits)
  if (argentine) return `+54 9 ${argentine[1]}`
  return digits ? `+${digits}` : ''
}
