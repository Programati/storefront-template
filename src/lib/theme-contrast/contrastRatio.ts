import { parse, wcagContrast } from 'culori'

export function contrastRatio(fg: string, bg: string): number {
  const a = parse(fg)
  const b = parse(bg)
  if (!a || !b) throw new Error(`Color no reconocido: "${a ? bg : fg}"`)
  if ((a.alpha ?? 1) < 1 || (b.alpha ?? 1) < 1) {
    throw new Error(
      'Color con transparencia: no hay contraste sin conocer el fondo',
    )
  }
  return wcagContrast(a, b)
}
