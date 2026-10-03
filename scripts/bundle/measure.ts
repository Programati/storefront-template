import { gzipSync } from 'node:zlib'

export type AssetSize = { name: string; raw: number; gzip: number }

export type BudgetResult = {
  ok: boolean
  total: number
  max: number
  headroom: number
}

export function measureAsset(
  name: string,
  content: Buffer | string,
): AssetSize {
  const buf = typeof content === 'string' ? Buffer.from(content) : content
  return { name, raw: buf.length, gzip: gzipSync(buf).length }
}

export function totalGzip(assets: AssetSize[]): number {
  return assets.reduce((sum, asset) => sum + asset.gzip, 0)
}

export function checkBudget(total: number, max: number): BudgetResult {
  return { ok: total <= max, total, max, headroom: max - total }
}

export function formatKb(bytes: number): string {
  return `${(bytes / 1000).toFixed(2)} kB`
}
