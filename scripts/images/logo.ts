/** Ruta del logo dentro del almacén de imágenes. */
export const LOGO_PATH = 'logo/logo.webp'
export const LOGO_MAX_WIDTH = 640
export const LOGO_MAX_HEIGHT = 160
/** Por debajo de este alto se avisa que se verá borroso en pantallas retina. */
export const LOGO_MIN_HEIGHT = 64
/** Tolerancia al recortar márgenes: el ruido del JPG no es blanco puro. */
export const TRIM_THRESHOLD = 10

/** Reduce para que entre en el máximo, sin deformar y sin agrandar nunca. */
export function fitInside(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const scale = Math.min(1, maxWidth / width, maxHeight / height)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}
