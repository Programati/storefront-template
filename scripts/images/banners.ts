import type { ProductImage, StoreContent } from '../../src/types'
import { fileBaseName, normalizeName } from './naming'
import type { ExpectedImage } from './plan'

/** Proporción ancho / alto de los banners (16:9). */
export const BANNER_ASPECT = 16 / 9
/** Por debajo de este ancho se avisa que el banner se verá borroso. */
export const BANNER_MIN_WIDTH = 1280

/** Banners declarados en las secciones hero del contenido. */
export function heroBanners(
  content: Pick<StoreContent, 'home'>,
): ProductImage[] {
  const banners: ProductImage[] = []
  for (const section of content.home.sections) {
    switch (section.type) {
      case 'hero':
        banners.push(...(section.banners ?? []))
        break
      case 'categories':
      case 'featured':
      case 'howToOrder':
      case 'faq':
        break
      default: {
        const unreachable: never = section
        throw new Error(
          `Sección no contemplada: ${JSON.stringify(unreachable)}`,
        )
      }
    }
  }
  return banners
}

export function expectedBanners(banners: ProductImage[]): ExpectedImage[] {
  return banners.map((banner, i) => ({
    name: normalizeName(fileBaseName(banner.path)),
    path: banner.path,
    productName: `Banner ${i + 1}`,
  }))
}

/** Nombres base repetidos: `planImages` pisaría uno sin avisar. */
export function duplicatedNames(expected: ExpectedImage[]): string[] {
  const counts = new Map<string, number>()
  for (const e of expected) counts.set(e.name, (counts.get(e.name) ?? 0) + 1)
  return [...counts].filter(([, n]) => n > 1).map(([name]) => name)
}

/** Etiquetas ("Banner 2") de los banners con alt vacío. */
export function bannersWithoutAlt(banners: ProductImage[]): string[] {
  return banners.flatMap((banner, i) =>
    banner.alt.trim() === '' ? [`Banner ${i + 1}`] : [],
  )
}
