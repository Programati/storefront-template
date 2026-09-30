import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn('mx-auto w-full max-w-6xl px-4 py-10', className)}>
      {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
      {description && (
        <p className="mt-1 text-muted-foreground">{description}</p>
      )}
      <div className={title || description ? 'mt-6' : undefined}>
        {children}
      </div>
    </section>
  )
}
