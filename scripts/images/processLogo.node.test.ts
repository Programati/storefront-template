import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { processLogo } from './processLogo'

let dir: string

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'logo-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

// 100×100 blanco con un cuadrado negro de 40×40 en el medio.
async function makeLogo(): Promise<string> {
  const path = join(dir, 'in.png')
  const square = await sharp({
    create: { width: 40, height: 40, channels: 3, background: '#000000' },
  })
    .png()
    .toBuffer()
  await sharp({
    create: { width: 100, height: 100, channels: 3, background: '#ffffff' },
  })
    .composite([{ input: square, left: 30, top: 30 }])
    .png()
    .toFile(path)
  return path
}

describe('processLogo', () => {
  it('recorta los márgenes y no agranda', async () => {
    const out = join(dir, 'logo.webp')
    const result = await processLogo(await makeLogo(), out)
    expect([result.width, result.height]).toEqual([40, 40])
    const meta = await sharp(out).metadata()
    expect([meta.width, meta.height]).toEqual([40, 40])
  })

  it('avisa si es chico y si no tiene transparencia', async () => {
    const result = await processLogo(await makeLogo(), join(dir, 'logo.webp'))
    expect(result.small).toBe(true)
    expect(result.hasAlpha).toBe(false)
  })

  it('detecta la transparencia real', async () => {
    const path = join(dir, 'alpha.png')
    const square = await sharp({
      create: { width: 40, height: 40, channels: 3, background: '#000000' },
    })
      .png()
      .toBuffer()
    await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: square, left: 30, top: 30 }])
      .png()
      .toFile(path)
    const result = await processLogo(path, join(dir, 'logo.webp'))
    expect(result.hasAlpha).toBe(true)
  })
})
