import type { HomeSection } from '@/types'
import { CategoriesSection } from './CategoriesSection'
import { FaqSection } from './FaqSection'
import { FeaturedSection } from './FeaturedSection'
import { HeroSection } from './HeroSection'
import { HowToOrderSection } from './HowToOrderSection'

function renderSection(section: HomeSection) {
  switch (section.type) {
    case 'hero':
      return <HeroSection ctaLabel={section.ctaLabel} />
    case 'categories':
      return <CategoriesSection title={section.title} />
    case 'featured':
      return <FeaturedSection title={section.title} />
    case 'howToOrder':
      return <HowToOrderSection title={section.title} steps={section.steps} />
    case 'faq':
      return <FaqSection title={section.title} items={section.items} />
    default: {
      // Si se agrega un tipo nuevo y falta el caso, TypeScript falla acá.
      const unreachable: never = section
      return unreachable
    }
  }
}

interface HomeSectionsProps {
  sections: HomeSection[]
}

export function HomeSections({ sections }: HomeSectionsProps) {
  return (
    <>
      {sections.map((section, index) => (
        <div key={`${section.type}-${index}`}>{renderSection(section)}</div>
      ))}
    </>
  )
}
