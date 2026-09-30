import type { ReactNode } from 'react'

interface SiteHeaderProps {
  title: string
  actions?: ReactNode
}

export function SiteHeader({ title, actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <span className="text-lg font-bold">{title}</span>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  )
}
