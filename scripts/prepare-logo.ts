import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { LOGO_MIN_HEIGHT, LOGO_PATH } from './images/logo'
import { splitInputs } from './images/plan'
import { processLogo } from './images/processLogo'

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const [inputDir = 'logo-raw', outputDir = 'images-ready'] = args.filter(
  (a) => !a.startsWith('--'),
)

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`

async function main() {
  let files: string[]
  try {
    files = await readdir(inputDir)
  } catch {
    console.error(
      `✖ No existe la carpeta "${inputDir}". Creala y poné el logo ahí.`,
    )
    process.exitCode = 1
    return
  }

  const { supported, ignored } = splitInputs(files)
  for (const file of ignored) {
    console.warn(`⚠ Ignorado (formato no soportado): ${file}`)
  }
  if (supported.length !== 1) {
    console.error(
      supported.length === 0
        ? `✖ No hay ningún logo en "${inputDir}".`
        : `✖ Hay ${supported.length} archivos en "${inputDir}": dejá uno solo.`,
    )
    process.exitCode = 1
    return
  }

  const [input] = supported
  if (checkOnly) {
    console.log(`• ${input} → ${LOGO_PATH}`)
    return
  }

  const output = join(outputDir, LOGO_PATH)
  await mkdir(dirname(output), { recursive: true })
  try {
    const result = await processLogo(join(inputDir, input), output)
    console.log(
      `✔ ${LOGO_PATH}  ${result.width}×${result.height}  ${kb(result.bytes)}`,
    )
    if (result.small) {
      console.warn(
        `⚠ Alto de ${result.height}px (menos de ${LOGO_MIN_HEIGHT}): se verá borroso en pantallas retina. Pedí una versión más grande.`,
      )
    }
    if (!result.hasAlpha) {
      console.warn(
        '⚠ El original no tiene transparencia: el logo va con su fondo propio.',
      )
    }
    console.log(
      `\nCopiá esto a "logo" en config.ts:\n  path: '${LOGO_PATH}',\n  width: ${result.width},\n  height: ${result.height},\n  alt: '<nombre de la tienda>',`,
    )
    console.log(
      `Subí "${outputDir}/logo/logo.webp" a la carpeta logo de ImageKit (sin sufijo aleatorio).`,
    )
  } catch (error) {
    console.error(
      `✖ ${input}: ${error instanceof Error ? error.message : error}`,
    )
    process.exitCode = 1
  }
}

main()
