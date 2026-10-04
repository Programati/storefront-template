export interface HowToOrderStep {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}

// Unión discriminada por `type`: cada sección declara solo los campos que usa.
export type HomeSection =
  | { type: 'hero'; ctaLabel: string }
  | { type: 'categories'; title: string }
  | { type: 'featured'; title: string }
  | { type: 'howToOrder'; title: string; steps: HowToOrderStep[] }
  | { type: 'faq'; title: string; items: FaqItem[] }

export interface StoreContent {
  home: {
    // El orden de la lista es el orden en pantalla. Quitar un ítem oculta la sección.
    sections: HomeSection[]
  }
}
