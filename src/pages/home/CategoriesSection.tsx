import { Section } from '@/components/shared/Section/Section'
import { CategoryChips, useCategories } from '@/features/catalog'

interface CategoriesSectionProps {
  title: string
}

export function CategoriesSection({ title }: CategoriesSectionProps) {
  const categories = useCategories()
  return (
    <Section title={title}>
      <CategoryChips categories={categories} />
    </Section>
  )
}
