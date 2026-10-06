import { ExternalLink, MapPin } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MapsLinkCardProps {
  /** Link ya validado por quien lo usa. Acá solo se exige que sea https. */
  url: string
  className?: string
}

function hostOf(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.host : null
  } catch {
    return null
  }
}

export function MapsLinkCard({ url, className }: MapsLinkCardProps) {
  const host = hostOf(url)
  if (!host) return null

  return (
    <div
      className={cn('flex items-center gap-3 rounded-md border p-3', className)}
    >
      <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Ubicación indicada</p>
        <p className="truncate text-sm text-muted-foreground">{host}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        Abrir en Google Maps
        <ExternalLink className="size-3.5" aria-hidden="true" />
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </div>
  )
}
