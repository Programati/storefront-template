export const MIN_TEXT_CONTRAST = 4.5

export interface ContrastPair {
  fg: string
  bg: string
  min: number
}

const pair = (fg: string, bg: string): ContrastPair => ({
  fg,
  bg,
  min: MIN_TEXT_CONTRAST,
})

export const TEXT_PAIRS: ContrastPair[] = [
  pair('foreground', 'background'),
  pair('card-foreground', 'card'),
  pair('popover-foreground', 'popover'),
  pair('primary-foreground', 'primary'),
  pair('secondary-foreground', 'secondary'),
  pair('muted-foreground', 'background'),
  pair('muted-foreground', 'muted'),
  pair('accent-foreground', 'accent'),
  pair('destructive-foreground', 'destructive'),
]
