import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  checkBudget,
  formatKb,
  measureAsset,
  totalGzip,
} from './bundle/measure'

const ASSETS_DIR = 'dist/assets'
const BUDGET_FILE = 'bundle-budget.json'

const files = readdirSync(ASSETS_DIR).filter((file) => file.endsWith('.js'))
if (files.length === 0) {
  console.error(`No hay .js en ${ASSETS_DIR}. Corré "pnpm build" primero.`)
  process.exit(1)
}

const assets = files
  .map((file) => measureAsset(file, readFileSync(join(ASSETS_DIR, file))))
  .sort((a, b) => b.gzip - a.gzip)

for (const asset of assets) {
  console.log(
    `${formatKb(asset.gzip).padStart(11)} gzip  ${formatKb(asset.raw).padStart(11)} raw  ${asset.name}`,
  )
}
const total = totalGzip(assets)
console.log(`\nTotal JS gzip: ${total} bytes (${formatKb(total)})`)

let max: unknown
try {
  max = (
    JSON.parse(readFileSync(BUDGET_FILE, 'utf8')) as { maxGzipBytes?: unknown }
  ).maxGzipBytes
} catch {
  max = undefined
}
if (typeof max !== 'number' || !Number.isFinite(max) || max <= 0) {
  console.error(
    `\nFalta ${BUDGET_FILE} con { "maxGzipBytes": <número> } (o es inválido).`,
  )
  process.exit(1)
}

const result = checkBudget(total, max)
if (!result.ok) {
  console.error(
    `\nSuperaste el tope por ${formatKb(-result.headroom)} (tope: ${formatKb(max)}).`,
  )
  process.exit(1)
}
console.log(
  `OK: te quedan ${formatKb(result.headroom)} hasta el tope (${formatKb(max)}).`,
)
