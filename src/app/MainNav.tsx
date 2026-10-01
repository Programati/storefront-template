import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'

// Para sumar secciones (preguntas frecuentes, contacto…) se agrega un ítem acá.
const items = [{ to: '/catalogo', label: 'Catálogo' }]

export function MainNav() {
  return (
    <nav aria-label="Principal" className="flex items-center gap-1">
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
