import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { storeContent } from '../src/store-pack/content'
import {
  BANNER_ASPECT,
  BANNER_MIN_WIDTH,
  bannersWithoutAlt,
  duplicatedNames,
  expectedBanners,
  heroBanners,
} from './images/banners'
import { invalidCatalogPaths, planImages, splitInputs } from './images/plan'
import { processImage } from './images/process'

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const [inputDir = 'banners-raw', outputDir = 'images-ready'] = args.filter(
  (a) => !a.startsWith('--'),
)

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`

async function main() {
  const banners = heroBanners(storeContent)
  if (banners.length === 0) {
    console.log('El hero de store-pack/content.ts no declara banners.')
    return
  }

  const expected = expectedBanners(banners)

  const noAlt = bannersWithoutAlt(banners)
  const invalid = invalidCatalogPaths(expected)
  const duplicated = duplicatedNames(expected)
  for (const label of noAlt) {
    console.error(`✖ ${label} no tiene alt (es obligatorio).`)
  }
  for (const e of invalid) {
    console.error(
      `✖ Ruta fuera de convención (${e.productName}): "${e.path}". ` +
        'Debe ser minúsculas, números y guiones, terminada en .webp.',
    )
  }
  for (const name of duplicated) {
    console.error(`✖ Dos banners comparten el nombre "${name}".`)
  }
  if (noAlt.length + invalid.length + duplicated.length > 0) {
    process.exitCode = 1
    return
  }

  let files: string[]
  try {
    files = await readdir(inputDir)
  } catch {
    console.error(
      `✖ No existe la carpeta "${inputDir}". Creala y poné las fotos apaisadas ahí.`,
    )
    process.exitCode = 1
    return
  }

  const { supported, ignored } = splitInputs(files)
  const plan = planImages(supported, expected)

  for (const file of ignored) {
    console.warn(`⚠ Ignorado (formato no soportado): ${file}`)
  }
  for (const c of plan.conflicts) {
    console.error(
      `✖ Conflicto "${c.name}": ${c.inputs.join(', ')} (dejá una sola)`,
    )
    process.exitCode = 1
  }
  for (const file of plan.unmatched) {
    console.warn(`⚠ "${file}" no corresponde a ningún banner declarado`)
  }

  for (const { input, expected: target } of plan.matched) {
    if (checkOnly) {
      console.log(`• ${input} → ${target.path}`)
      continue
    }
    const output = join(outputDir, target.path)
    await mkdir(dirname(output), { recursive: true })
    try {
      const result = await processImage(join(inputDir, input), output, {
        aspect: BANNER_ASPECT,
        minWidth: BANNER_MIN_WIDTH,
      })
      const note = result.small
        ? `  ⚠ angosta (${result.width}px): se verá borrosa`
        : ''
      console.log(
        `✔ ${target.path}  ${result.width}×${result.height}  ${kb(result.bytes)}${note}`,
      )
    } catch (error) {
      console.error(
        `✖ ${input}: ${error instanceof Error ? error.message : error}`,
      )
      process.exitCode = 1
    }
  }

  for (const e of plan.missing) {
    console.warn(`⚠ Falta la foto de "${e.productName}" (${e.name})`)
  }

  const verb = checkOnly ? 'por procesar' : 'procesadas'
  if (!checkOnly && plan.matched.length > 0) {
    console.log(
      `Subí el contenido de "${outputDir}/banners" a la carpeta banners de ImageKit.`,
    )
  }
  console.log(
    `\n${plan.matched.length} ${verb} · ${plan.unmatched.length} sin banner · ` +
      `${plan.missing.length} faltantes · ${plan.conflicts.length} conflictos`,
  )
}

main()
