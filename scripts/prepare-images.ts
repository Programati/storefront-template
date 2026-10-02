import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { catalog } from '../src/store-pack/catalog'
import {
  expectedImages,
  invalidCatalogPaths,
  planImages,
  splitInputs,
} from './images/plan'
import { processImage } from './images/process'

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const [inputDir = 'images-raw', outputDir = 'images-ready'] = args.filter(
  (a) => !a.startsWith('--'),
)

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`

async function main() {
  const allExpected = expectedImages(catalog.products)

  const invalid = invalidCatalogPaths(allExpected)
  for (const e of invalid) {
    console.error(
      `✖ Ruta fuera de convención en el catálogo (${e.productName}): "${e.path}". ` +
        'Debe ser minúsculas, números y guiones, terminada en .webp.',
    )
  }
  if (invalid.length > 0) process.exitCode = 1

  const expected = allExpected.filter((e) => !invalid.includes(e))

  let files: string[]
  try {
    files = await readdir(inputDir)
  } catch {
    console.error(
      `✖ No existe la carpeta "${inputDir}". Creala y poné las fotos crudas ahí.`,
    )
    process.exitCode = 1
    return
  }

  const { supported, ignored } = splitInputs(files)
  const plan = planImages(supported, expected)

  for (const file of ignored) {
    console.warn(
      `⚠ Ignorado (formato no soportado): ${file}` +
        (/\.hei[cf]$/i.test(file)
          ? ' — HEIC: exportalo como JPG desde el celular'
          : ''),
    )
  }
  for (const c of plan.conflicts) {
    console.error(
      `✖ Conflicto "${c.name}": ${c.inputs.join(', ')} (dejá una sola)`,
    )
    process.exitCode = 1
  }
  for (const file of plan.unmatched) {
    console.warn(`⚠ "${file}" no corresponde a ningún producto del catálogo`)
  }

  for (const { input, expected: target } of plan.matched) {
    if (checkOnly) {
      console.log(`• ${input} → ${target.path}`)
      continue
    }
    const output = join(outputDir, target.path)
    await mkdir(dirname(output), { recursive: true })
    try {
      const result = await processImage(join(inputDir, input), output)
      const note = result.small
        ? `  ⚠ chica (${result.side}px): se verá borrosa`
        : ''
      console.log(
        `✔ ${target.path}  ${result.side}×${result.side}  ${kb(result.bytes)}${note}`,
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
  console.log(
    `\n${plan.matched.length} ${verb} · ${plan.unmatched.length} sin producto · ` +
      `${plan.missing.length} faltantes · ${plan.conflicts.length} conflictos`,
  )
  if (!checkOnly && plan.matched.length > 0) {
    console.log(
      `Subí el contenido de "${outputDir}/products" a la carpeta products de ImageKit.`,
    )
  }
  console.log(
    `\n${plan.matched.length} ${verb} · ${plan.unmatched.length} sin producto · ` +
      `${plan.missing.length} faltantes · ${plan.conflicts.length} conflictos · ` +
      `${invalid.length} rutas inválidas`,
  )
}

main()
