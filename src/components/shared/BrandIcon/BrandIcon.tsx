import { FACEBOOK_PATH, INSTAGRAM_PATH, WHATSAPP_PATH } from './brandIconPaths'

export type BrandName = 'whatsapp' | 'facebook' | 'instagram'

const PATHS: Record<BrandName, string> = {
  whatsapp: WHATSAPP_PATH,
  facebook: FACEBOOK_PATH,
  instagram: INSTAGRAM_PATH,
}

interface BrandIconProps {
  name: BrandName
  className?: string
}

// Decorativo: el nombre accesible lo da el texto del enlace que lo contiene.
export function BrandIcon({ name, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
