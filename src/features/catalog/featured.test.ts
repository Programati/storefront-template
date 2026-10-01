import { describe, expect, it } from 'vitest'
import type { Product } from '@/types'
import { pickFeatured } from './featured'

const make = (id: string, featured = false) => ({ id, featured }) as Product

describe('pickFeatured', () => {
  it('prioriza los marcados como destacados', () => {
    const products = [make('a'), make('b', true), make('c')]
    expect(pickFeatured(products).map((p) => p.id)).toEqual(['b'])
  })

  it('si no hay marcados, usa los primeros', () => {
    const products = [make('a'), make('b'), make('c')]
    expect(pickFeatured(products, 2).map((p) => p.id)).toEqual(['a', 'b'])
  })
})
