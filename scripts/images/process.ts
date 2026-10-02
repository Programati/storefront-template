import sharp from 'sharp'

export const MAX_SIDE = 1600
export const QUALITY = 85
export const MIN_RECOMMENDED_SIDE = 800

export interface ProcessResult {
  side: number
  bytes: number
  /** true si la foto es más chica de lo recomendado. */
  small: boolean
}

/** Recorta al cuadrado central, rota según EXIF, convierte a WebP. */
export async function processImage(
  inputPath: string,
  outputPath: string,
): Promise<ProcessResult> {
  const { width, height, orientation = 1 } = await sharp(inputPath).metadata()
  if (!width || !height)
    throw new Error('No se pudo leer el tamaño de la imagen')

  // Orientaciones EXIF 5-8 giran la foto 90°: ancho y alto se intercambian.
  const [w, h] = orientation >= 5 ? [height, width] : [width, height]
  const side = Math.min(w, h, MAX_SIDE)

  const info = await sharp(inputPath)
    .rotate()
    .resize(side, side, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITY })
    .toFile(outputPath)

  return { side, bytes: info.size, small: side < MIN_RECOMMENDED_SIDE }
}
