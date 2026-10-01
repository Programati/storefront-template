export interface Variant {
  id: string
  label: string
  price: number
}

export interface Choice {
  id: string
  label: string
  priceDelta?: number
}

export interface OptionGroup {
  id: string
  label: string
  type: 'single' | 'multiple'
  required: boolean
  choices: Choice[]
}

export interface ProductImage {
  path: string // SOLO la ruta relativa; la URL base vive en la config
  alt: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  brandId?: string
  image: ProductImage
  gallery?: ProductImage[]
  variantLabel?: string // nombre del grupo de variantes: 'Tamaño', 'Formato', 'Talle'
  variants: Variant[] // define el precio (ej: tamaño, formato)
  optionGroups: OptionGroup[] // no define precio por sí solo (ej: sabor, extras)
  details?: Record<string, string> // atributos libres, distintos por rubro
  soldOut?: boolean
  featured?: boolean
}

export interface Category {
  id: string
  slug: string
  name: string
}

export interface VolumeTier {
  minQty: number
  unitPrice: number
}

export interface PricingRule {
  id: string
  match: { productIds?: string[]; variantIds?: string[] }
  tiers: VolumeTier[]
}

export interface DeliveryMethod {
  id: string
  label: string
  requiresAddress: boolean
  note?: string
}

export interface MessageStyle {
  headerEmoji?: string
  footerNote?: string
}

export type ImageProvider = 'imagekit' | 'placeholder'

export interface ImageConfig {
  provider: ImageProvider
  /** URL base del endpoint, sin barra final. Ej: https://ik.imagekit.io/tu_id */
  baseUrl: string
}

export type CardLook = 'cozy' | 'catalog' | 'spec'
export type SchedulingMode = 'none' | 'date' | 'datetime'

export interface StoreConfig {
  storeName: string
  tagline?: string
  whatsappNumber: string // formato E.164 sin el '+', ej: '5493794000000'
  currency: string // ej: 'ARS'
  maxQtyPerLine: number // tu límite de 1..100
  deliveryMethods: DeliveryMethod[]
  messageStyle?: MessageStyle
  cardLook?: CardLook
  scheduling?: SchedulingMode // qué pide el checkout: nada, fecha, o fecha + horario (por defecto 'date')
  images?: ImageConfig
}

export interface Catalog {
  categories: Category[]
  products: Product[]
  pricingRules: PricingRule[]
}

export interface CartLine {
  lineId: string
  productId: string
  variantId: string
  selected: Record<string, string[]> // groupId → choiceIds seleccionados
  qty: number // siempre entre 1 y config.maxQtyPerLine
}
