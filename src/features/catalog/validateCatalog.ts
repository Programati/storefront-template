import type { Catalog, Product, ProductImage } from '@/types'

export type IssueLevel = 'error' | 'warning'

export interface CatalogIssue {
  level: IssueLevel
  /** Qué tiene el problema: un id de producto, un valor repetido o `regla:<id>`. */
  subject: string
  message: string
}

const error = (subject: string, message: string): CatalogIssue => ({
  level: 'error',
  subject,
  message,
})

const warning = (subject: string, message: string): CatalogIssue => ({
  level: 'warning',
  subject,
  message,
})

const normalize = (text: string) => text.trim().toLowerCase()

/** Valores que aparecen más de una vez (cada uno se informa una sola vez). */
function repeated(values: string[]): string[] {
  const seen = new Set<string>()
  const result = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) result.add(value)
    seen.add(value)
  }
  return [...result]
}

function checkImage(
  product: Product,
  image: ProductImage,
  where: string,
): CatalogIssue[] {
  const alt = normalize(image.alt)
  if (alt === '') return [error(product.id, `${where}: alt vacío`)]
  if (alt === normalize(product.name)) {
    return [
      warning(product.id, `${where}: el alt repite el nombre del producto`),
    ]
  }
  return []
}

function checkProduct(
  product: Product,
  categoryIds: Set<string>,
): CatalogIssue[] {
  const issues: CatalogIssue[] = []

  if (product.variants.length === 0) {
    issues.push(
      error(
        product.id,
        'sin variantes: necesita al menos una (define el precio)',
      ),
    )
  }
  if (!categoryIds.has(product.categoryId)) {
    issues.push(
      error(
        product.id,
        `categoryId "${product.categoryId}" no existe en categories`,
      ),
    )
  }

  issues.push(...checkImage(product, product.image, 'imagen principal'))
  product.gallery?.forEach((image, index) => {
    issues.push(...checkImage(product, image, `galería #${index + 1}`))
  })

  return issues
}

function checkUniqueness(products: Product[]): CatalogIssue[] {
  const variantIds = products.flatMap((p) => p.variants.map((v) => v.id))
  return [
    ...repeated(products.map((p) => p.id)).map((id) =>
      error(id, 'id de producto repetido'),
    ),
    ...repeated(products.map((p) => p.slug)).map((slug) =>
      error(slug, `slug repetido: "${slug}"`),
    ),
    ...repeated(variantIds).map((id) =>
      error(
        id,
        `id de variante repetido: "${id}" (debe ser único en todo el catálogo)`,
      ),
    ),
  ]
}

function checkPricingRules(catalog: Catalog): CatalogIssue[] {
  const productIds = new Set(catalog.products.map((p) => p.id))
  const variantIds = new Set(
    catalog.products.flatMap((p) => p.variants.map((v) => v.id)),
  )

  return catalog.pricingRules.flatMap((rule) => {
    const subject = `regla:${rule.id}`
    const problems: CatalogIssue[] = []
    if (rule.tiers.length === 0) {
      problems.push(error(subject, 'sin tiers: la promo nunca se aplicaría'))
    }
    if (!rule.match.productIds?.length && !rule.match.variantIds?.length) {
      problems.push(
        error(subject, 'match vacío: no apunta a ningún producto ni variante'),
      )
    }
    return [
      ...(rule.match.productIds ?? [])
        .filter((id) => !productIds.has(id))
        .map((id) =>
          error(
            subject,
            `productId "${id}" no existe: la promo nunca se aplicaría`,
          ),
        ),
      ...(rule.match.variantIds ?? [])
        .filter((id) => !variantIds.has(id))
        .map((id) =>
          error(
            subject,
            `variantId "${id}" no existe: la promo nunca se aplicaría`,
          ),
        ),
      ...problems,
    ]
  })
}

export function validateCatalog(catalog: Catalog): CatalogIssue[] {
  const categoryIds = new Set(catalog.categories.map((c) => c.id))
  return [
    ...catalog.products.flatMap((p) => checkProduct(p, categoryIds)),
    ...checkUniqueness(catalog.products),
    ...checkPricingRules(catalog),
    ...checkOverlappingRules(catalog),
  ]
}
function checkOverlappingRules(catalog: Catalog): CatalogIssue[] {
  return catalog.products.flatMap((product) =>
    product.variants.flatMap((variant) => {
      const matching = catalog.pricingRules.filter(
        (rule) =>
          rule.match.variantIds?.includes(variant.id) ||
          rule.match.productIds?.includes(product.id),
      )
      return matching.length > 1
        ? [
            error(
              variant.id,
              `la variante la matchean varias reglas (${matching.map((r) => r.id).join(', ')}): solo se aplica la primera`,
            ),
          ]
        : []
    }),
  )
}
