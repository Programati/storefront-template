import { describe, expect, it } from 'vitest'
import { sanitizeInline, sanitizeNotes } from './sanitize'

describe('sanitizeInline', () => {
  it('quita los caracteres de formato de WhatsApp', () => {
    expect(sanitizeInline('*Ana* _P_ ~x~ `y`', 50)).toBe('Ana P x y')
  })

  it('colapsa saltos de línea y espacios', () => {
    expect(sanitizeInline('Ana\n\n  Pérez', 50)).toBe('Ana Pérez')
  })

  it('respeta el largo máximo sin partir un emoji', () => {
    expect(sanitizeInline('ab😀cd', 3)).toBe('ab😀')
  })

  it('saca los caracteres de dirección de texto', () => {
    expect(sanitizeInline('ab\u202Ecd', 50)).toBe('abcd')
  })
})

describe('sanitizeNotes', () => {
  it('devuelve una entrada por línea no vacía', () => {
    expect(sanitizeNotes('uno\n\n dos ', 100)).toEqual(['uno', 'dos'])
  })

  it('limita el largo total', () => {
    expect(sanitizeNotes('abcdef\nghijkl', 8)).toEqual(['abcdef', 'gh'])
  })
})
