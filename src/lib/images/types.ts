export interface ImageOptions {
  /** Ancho en px del resultado. */
  width: number
  /** 1..100. Si falta, se usa DEFAULT_QUALITY. */
  quality?: number
}

/** Un adaptador sabe armar la URL final para UN proveedor. */
export type ImageAdapter = (
  baseUrl: string,
  path: string,
  options: ImageOptions,
) => string

export interface ResolvedImage {
  /** URL de respaldo (navegadores sin srcset, og:image, etc.). */
  src: string
  /** Lista "url 320w, url 480w, ..." para <img srcset>. */
  srcSet: string
}

export interface ResolveOptions {
  /** Ancho de `src`. */
  width?: number
  /** Anchos a incluir en `srcSet`. */
  widths?: readonly number[]
  quality?: number
}

export type ImageResolver = (
  path: string,
  options?: ResolveOptions,
) => ResolvedImage
