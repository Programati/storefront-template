import type { ProductImage } from './store'

/** Foto de banner: misma forma que una foto de producto (ruta relativa + alt). */
export type BannerImage = ProductImage

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
  | { type: 'hero'; ctaLabel: string; banners?: BannerImage[] }
  | { type: 'categories'; title: string }
  | { type: 'featured'; title: string }
  | { type: 'howToOrder'; title: string; steps: HowToOrderStep[] }
  | { type: 'faq'; title: string; items: FaqItem[] }

export interface FooterColumn {
  title: string
  lines: string[]
}

export interface StoreContent {
  // Opcional: si existe, se muestra una franja arriba de todo. Sin el campo, no se muestra nada.
  demoNotice?: string
  // Opcional: columnas informativas del footer (retiro, horarios…). Sin el campo, no hay columnas.
  footer?: { columns?: FooterColumn[] }
  home: {
    // El orden de la lista es el orden en pantalla. Quitar un ítem oculta la sección.
    sections: HomeSection[]
  }
}
