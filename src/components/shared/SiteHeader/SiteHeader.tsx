import type { ReactNode } from 'react'

interface SiteHeaderProps {
  brand: ReactNode
  nav?: ReactNode
  actions?: ReactNode
}

export function SiteHeader({ brand, nav, actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <div className="min-w-0 truncate text-lg font-bold">{brand}</div>
        {nav}
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </div>
    </header>
  )
}
