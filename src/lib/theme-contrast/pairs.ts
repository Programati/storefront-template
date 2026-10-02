export const MIN_TEXT_CONTRAST = 4.5
export const MIN_GRAPHIC_CONTRAST = 3

export interface ContrastPair {
  fg: string
  bg: string
  min: number
}

const text = (fg: string, bg: string): ContrastPair => ({
  fg,
  bg,
  min: MIN_TEXT_CONTRAST,
})
const graphic = (fg: string, bg: string): ContrastPair => ({
  fg,
  bg,
  min: MIN_GRAPHIC_CONTRAST,
})

export const TEXT_PAIRS: ContrastPair[] = [
  text('foreground', 'background'),
  text('card-foreground', 'card'),
  text('popover-foreground', 'popover'),
  text('primary-foreground', 'primary'),
  text('secondary-foreground', 'secondary'),
  text('accent-foreground', 'accent'),
  text('destructive-foreground', 'destructive'),
  // Texto secundario sobre cada superficie donde se usa
  text('muted-foreground', 'background'),
  text('muted-foreground', 'muted'),
  text('muted-foreground', 'card'),
  text('muted-foreground', 'popover'),
  // Errores y asteriscos en rojo sobre superficies
  text('destructive', 'background'),
  text('destructive', 'card'),
  text('destructive', 'popover'),
  // Iconos de color (no texto): 3:1
  graphic('primary', 'background'),
]
