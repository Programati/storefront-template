import type { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

interface ResponsiveSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
}

// Desde abajo en móvil, desde el costado en escritorio. Los hijos reciben un
// contenedor flex vertical: ellos deciden qué scrollea y qué queda fijo.
export function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ResponsiveSheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? 'right' : 'bottom'}
        className={cn(
          'flex flex-col gap-0 p-0',
          isDesktop ? 'sm:max-w-md' : 'max-h-[90dvh] rounded-t-2xl',
        )}
      >
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle>{title}</SheetTitle>
          {/* Radix exige una descripción por accesibilidad; si no hay, queda solo para lectores de pantalla */}
          <SheetDescription
            className={description ? 'line-clamp-2' : 'sr-only'}
          >
            {description ?? title}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
