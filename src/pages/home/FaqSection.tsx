import { Section } from '@/components/shared/Section/Section'
import type { FaqItem } from '@/types'

interface FaqSectionProps {
  title: string
  items: FaqItem[]
}

export function FaqSection({ title, items }: FaqSectionProps) {
  return (
    <Section title={title}>
      <div className="max-w-2xl space-y-2">
        {items.map((item) => (
          <details
            key={item.question}
            className="rounded-md border p-3 text-sm"
          >
            <summary className="cursor-pointer font-medium">
              {item.question}
            </summary>
            <p className="mt-3 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
