import type { CartLine, Product } from '@/types'

// Se corre una sola vez, al hidratar el carrito guardado: saca líneas de
// productos que ya no existen o que se agotaron, y recorta la cantidad al
// máximo vigente. Así un carrito viejo nunca cobra ni muestra algo que el
// catálogo de hoy no respalda.
export function sanitizeCartLines(
  lines: CartLine[],
  products: Product[],
  maxQty: number,
): CartLine[] {
  const productById = new Map(products.map((p) => [p.id, p]))

  return lines.reduce<CartLine[]>((acc, line) => {
    const product = productById.get(line.productId)
    if (!product || product.soldOut) return acc

    const variant = product.variants.find((v) => v.id === line.variantId)
    if (!variant) return acc

    acc.push({
      ...line,
      qty: Math.min(maxQty, Math.max(1, Math.round(line.qty))),
    })
    return acc
  }, [])
}
