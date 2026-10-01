// WhatsApp interpreta *negrita*, _cursiva_, ~tachado~ y `código`: si el cliente
// los escribe, deforman el ticket. También sacamos caracteres de control, de
// dirección de texto (pueden disfrazar contenido) y sustitutos sueltos
// (harían fallar encodeURIComponent).
const UNSAFE_CHARS =
  /[*_~`\p{Cc}\p{Cs}\u200E\u200F\u202A-\u202E\u2066-\u2069]/gu
const MAX_NOTE_LINES = 6

export function sanitizeInline(text: string, maxLength: number): string {
  const cleaned = text.replace(/\s+/g, ' ').replace(UNSAFE_CHARS, '').trim()
  // Array.from corta por caracteres completos: un emoji nunca queda partido a la mitad.
  return Array.from(cleaned).slice(0, maxLength).join('').trim()
}

// Devuelve una entrada por línea no vacía, con un tope de líneas y de largo total.
export function sanitizeNotes(text: string, maxLength: number): string[] {
  const lines: string[] = []
  let remaining = maxLength

  for (const raw of text.split(/\r?\n/)) {
    if (lines.length >= MAX_NOTE_LINES || remaining <= 0) break
    const line = sanitizeInline(raw, remaining)
    if (!line) continue
    lines.push(line)
    remaining -= Array.from(line).length
  }
  return lines
}
