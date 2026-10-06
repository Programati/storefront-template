import sharp from 'sharp'

export const MAX_SIDE = 1600
export const QUALITY = 85
export const MIN_RECOMMENDED_SIDE = 800

export interface ProcessOptions {
  /** Proporción ancho / alto del resultado. 1 = cuadrado (por defecto). */
  aspect?: number
  /** Ancho mínimo recomendado; por debajo se avisa que se verá borrosa. */
  minWidth?: number
}

export interface ProcessResult {
  width: number
  height: number
  bytes: number
  /** true si la foto es más chica de lo recomendado. */
  small: boolean
}

/** Recorta al centro con la proporción pedida, rota según EXIF, convierte a WebP. */
export async function processImage(
  inputPath: string,
  outputPath: string,
  { aspect = 1, minWidth = MIN_RECOMMENDED_SIDE }: ProcessOptions = {},
): Promise<ProcessResult> {
  const { width, height, orientation = 1 } = await sharp(inputPath).metadata()
  if (!width || !height)
    throw new Error('No se pudo leer el tamaño de la imagen')

  // Orientaciones EXIF 5-8 giran la foto 90°: ancho y alto se intercambian.
  const [w, h] = orientation >= 5 ? [height, width] : [width, height]
  const outWidth = Math.floor(Math.min(w, h * aspect, MAX_SIDE))
  const outHeight = Math.round(outWidth / aspect)

  const info = await sharp(inputPath)
    .rotate()
    .resize(outWidth, outHeight, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITY })
    .toFile(outputPath)

  return {
    width: outWidth,
    height: outHeight,
    bytes: info.size,
    small: outWidth < minWidth,
  }
}
