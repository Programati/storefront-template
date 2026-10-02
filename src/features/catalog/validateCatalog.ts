import type { Catalog, Product, ProductImage } from '@/types'

export type IssueLevel = 'error' | 'warning'

export interface CatalogIssue {
  level: IssueLevel
  productId: string
  message: string
}

const normalize = (text: string) => text.trim().toLowerCase()

function checkImage(
  product: Product,
  image: ProductImage,
  where: string,
): CatalogIssue[] {
  const alt = normalize(image.alt)
  if (alt === '') {
    return [
      { level: 'error', productId: product.id, message: `${where}: alt vacío` },
    ]
  }
  if (alt === normalize(product.name)) {
    return [
      {
        level: 'warning',
        productId: product.id,
        message: `${where}: el alt repite el nombre del producto`,
      },
    ]
  }
  return []
}

export function validateCatalog(catalog: Catalog): CatalogIssue[] {
  return catalog.products.flatMap((product) => {
    const issues: CatalogIssue[] = []

    if (product.variants.length === 0) {
      issues.push({
        level: 'error',
        productId: product.id,
        message: 'sin variantes: necesita al menos una (define el precio)',
      })
    }

    issues.push(...checkImage(product, product.image, 'imagen principal'))
    product.gallery?.forEach((image, index) => {
      issues.push(...checkImage(product, image, `galería #${index + 1}`))
    })

    return issues
  })
}
