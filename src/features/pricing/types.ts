export interface PricedLine {
  lineId: string
  productId: string
  variantId: string
  qty: number
  baseUnitPrice: number // precio de lista (variante + extras), sin promo
  unitPrice: number // precio final por unidad, con promo aplicada
  lineTotal: number // unitPrice × qty
  lineSavings: number // (baseUnitPrice - unitPrice) × qty
}

export interface CartTotals {
  subtotal: number // suma de baseUnitPrice × qty de todas las líneas
  discount: number // suma de lineSavings
  total: number // subtotal - discount
}
