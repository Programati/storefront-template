import { describe, expect, it } from 'vitest'
import type { OptionGroup, Product } from '@/types'
import {
  cleanSelection,
  getMissingRequiredGroups,
  toggleChoice,
} from './productSelection'

const single: OptionGroup = {
  id: 'g1',
  label: 'Uno',
  type: 'single',
  required: true,
  choices: [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
  ],
}
const multiple: OptionGroup = {
  id: 'g2',
  label: 'Varios',
  type: 'multiple',
  required: false,
  choices: [
    { id: 'x', label: 'X' },
    { id: 'y', label: 'Y' },
  ],
}
const product = { optionGroups: [single, multiple] } as Product

describe('productSelection', () => {
  it('single reemplaza la elección anterior', () => {
    expect(toggleChoice(single, 'b', ['a'])).toEqual(['b'])
  })

  it('multiple agrega y quita', () => {
    expect(toggleChoice(multiple, 'x', [])).toEqual(['x'])
    expect(toggleChoice(multiple, 'y', ['x'])).toEqual(['x', 'y'])
    expect(toggleChoice(multiple, 'x', ['x', 'y'])).toEqual(['y'])
  })

  it('detecta grupos obligatorios sin elegir', () => {
    expect(getMissingRequiredGroups(product, {})).toEqual([single])
    expect(getMissingRequiredGroups(product, { g1: ['a'] })).toEqual([])
  })

  it('limpia los grupos vacíos', () => {
    expect(cleanSelection({ g1: ['a'], g2: [] })).toEqual({ g1: ['a'] })
  })
})
