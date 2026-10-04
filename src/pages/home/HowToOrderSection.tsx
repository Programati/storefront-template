import { Section } from '@/components/shared/Section/Section'
import type { HowToOrderStep } from '@/types'

interface HowToOrderSectionProps {
  title: string
  steps: HowToOrderStep[]
}

export function HowToOrderSection({ title, steps }: HowToOrderSectionProps) {
  return (
    <Section title={title}>
      <ol className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
