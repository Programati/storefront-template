import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const chipClass = (isActive: boolean) =>
  cn(
    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'border-primary bg-primary text-primary-foreground'
      : 'hover:bg-accent',
  )

export function CategoryChips({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Categorías" className="flex flex-wrap gap-2">
      <NavLink
        to="/catalogo"
        end
        className={({ isActive }) => chipClass(isActive)}
      >
        Todo
      </NavLink>
      {categories.map((category) => (
        <NavLink
          key={category.id}
          to={`/catalogo/${category.slug}`}
          className={({ isActive }) => chipClass(isActive)}
        >
          {category.name}
        </NavLink>
      ))}
    </nav>
  )
}
