import type { ReactNode } from 'react'

interface SiteBrandProps {
  name: string
  /** La imagen del logo, ya armada por quien lo usa. */
  logo?: ReactNode
  /** Con logo, muestra también el nombre. */
  showName?: boolean
}

export function SiteBrand({ name, logo, showName = false }: SiteBrandProps) {
  const withName = !logo || showName
  return (
    <span className="flex items-center gap-2">
      {logo}
      {withName && <span className="truncate">{name}</span>}
    </span>
  )
}
