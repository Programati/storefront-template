import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('el último valor pisa al anterior cuando entran en conflicto', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('un className de props pisa al de base (uso típico en components/ui)', () => {
    expect(cn('bg-primary text-sm', 'bg-destructive')).toBe(
      'text-sm bg-destructive',
    )
  })

  it('un utilitario específico posterior no borra al general anterior', () => {
    expect(cn('p-4', 'px-2')).toBe('p-4 px-2')
  })

  it('un utilitario general posterior sí pisa al específico anterior', () => {
    expect(cn('px-2', 'p-4')).toBe('p-4')
  })

  it('no confunde clases que comparten prefijo pero son de grupos distintos', () => {
    expect(cn('text-sm', 'text-destructive')).toBe('text-sm text-destructive')
  })

  it('acepta condicionales, objetos y arrays, e ignora los falsy', () => {
    const active = false
    expect(
      cn('base', active && 'activo', undefined, null, [
        'a',
        { b: true, c: false },
      ]),
    ).toBe('base a b')
  })
})
