// scripts/images/plan.ts
import { extname } from 'node:path'
import type { Product } from '../../src/types'
import { fileBaseName, isCanonicalPath, normalizeName } from './naming'

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

export interface ExpectedImage {
  /** Nombre sin carpeta ni extensión; es la clave de emparejamiento. */
  name: string
  /** Ruta tal cual está en el catálogo. */
  path: string
  productName: string
}

export interface PlanItem {
  input: string
  expected: ExpectedImage
}

export interface ImagePlan {
  matched: PlanItem[]
  /** Fotos crudas que no corresponden a ningún producto. */
  unmatched: string[]
  /** Imágenes del catálogo sin foto cruda. */
  missing: ExpectedImage[]
  /** Varias fotos crudas que apuntan al mismo destino (ej. alfa.jpg y alfa.png). */
  conflicts: { name: string; inputs: string[] }[]
}

type ProductImages = Pick<Product, 'name' | 'image' | 'gallery'>

export function expectedImages(products: ProductImages[]): ExpectedImage[] {
  return products.flatMap((product) =>
    [product.image, ...(product.gallery ?? [])].map((img) => ({
      name: normalizeName(fileBaseName(img.path)),
      path: img.path,
      productName: product.name,
    })),
  )
}

/** Rutas del catálogo que no siguen la convención (causa típica de 404). */
export function invalidCatalogPaths(
  expected: ExpectedImage[],
): ExpectedImage[] {
  return expected.filter((e) => !isCanonicalPath(e.path))
}

export function splitInputs(files: string[]): {
  supported: string[]
  ignored: string[]
} {
  const supported: string[] = []
  const ignored: string[] = []
  for (const file of files) {
    const ext = extname(file).toLowerCase()
    ;(SUPPORTED_EXTENSIONS.includes(ext) ? supported : ignored).push(file)
  }
  return { supported, ignored }
}

export function planImages(
  inputs: string[],
  expected: ExpectedImage[],
): ImagePlan {
  const expectedByName = new Map(expected.map((e) => [e.name, e]))

  const groups = new Map<string, string[]>()
  for (const input of inputs) {
    const key = normalizeName(input)
    groups.set(key, [...(groups.get(key) ?? []), input])
  }

  const plan: ImagePlan = {
    matched: [],
    unmatched: [],
    missing: [],
    conflicts: [],
  }
  const touched = new Set<string>()

  for (const [name, files] of groups) {
    const target = expectedByName.get(name)
    if (!target) {
      plan.unmatched.push(...files)
    } else if (files.length > 1) {
      plan.conflicts.push({ name, inputs: files })
      touched.add(name)
    } else {
      plan.matched.push({ input: files[0], expected: target })
      touched.add(name)
    }
  }

  plan.missing = expected.filter((e) => !touched.has(e.name))
  return plan
}
