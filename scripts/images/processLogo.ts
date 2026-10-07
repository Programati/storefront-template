import sharp from 'sharp'
import {
  LOGO_MAX_HEIGHT,
  LOGO_MAX_WIDTH,
  LOGO_MIN_HEIGHT,
  TRIM_THRESHOLD,
  fitInside,
} from './logo'

export interface LogoResult {
  width: number
  height: number
  bytes: number
  /** true si es más bajo de lo recomendado. */
  small: boolean
  /** false si el original no tiene transparencia (va con su propio fondo). */
  hasAlpha: boolean
}

/** Rota según EXIF, recorta márgenes, reduce sin deformar y guarda WebP sin pérdida. */
export async function processLogo(
  inputPath: string,
  outputPath: string,
): Promise<LogoResult> {
  // Transparencia REAL: un canal alfa con todos los píxeles opacos no cuenta.
  const { isOpaque } = await sharp(inputPath).stats()
  const hasAlpha = !isOpaque

  // PNG intermedio: si fuera JPEG, sharp lo recomprimiría con pérdida.
  const { data, info } = await sharp(inputPath)
    .rotate()
    .trim({ threshold: TRIM_THRESHOLD })
    .png()
    .toBuffer({ resolveWithObject: true })

  const size = fitInside(
    info.width,
    info.height,
    LOGO_MAX_WIDTH,
    LOGO_MAX_HEIGHT,
  )
  const out = await sharp(data)
    .resize(size.width, size.height, { fit: 'fill' })
    .webp({ lossless: true })
    .toFile(outputPath)

  return {
    width: size.width,
    height: size.height,
    bytes: out.size,
    small: size.height < LOGO_MIN_HEIGHT,
    hasAlpha,
  }
}
