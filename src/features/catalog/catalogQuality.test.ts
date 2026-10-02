import { describe, expect, it } from 'vitest'
// Excepción deliberada a "nadie importa store-pack": este test existe para validarlo.
import { catalog } from '@/store-pack/catalog'
import { validateCatalog } from './validateCatalog'

describe('calidad del catálogo de store-pack', () => {
  const issues = validateCatalog(catalog)

  it('no tiene errores', () => {
    expect(issues.filter((issue) => issue.level === 'error')).toEqual([])
  })

  it('informa las advertencias (no falla)', () => {
    const warnings = issues.filter((issue) => issue.level === 'warning')
    if (warnings.length > 0) {
      console.warn(
        `Advertencias del catálogo:\n${warnings
          .map((w) => `- ${w.productId}: ${w.message}`)
          .join('\n')}`,
      )
    }
    expect(true).toBe(true)
  })
})
