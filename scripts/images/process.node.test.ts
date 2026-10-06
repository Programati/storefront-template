import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { processImage } from './process'

let dir: string

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'process-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

async function makePng(width: number, height: number): Promise<string> {
  const path = join(dir, 'in.png')
  await sharp({
    create: { width, height, channels: 3, background: '#888888' },
  })
    .png()
    .toFile(path)
  return path
}

describe('processImage', () => {
  it('por defecto recorta al cuadrado', async () => {
    const out = join(dir, 'out.webp')
    const result = await processImage(await makePng(2000, 1000), out)
    expect([result.width, result.height]).toEqual([1000, 1000])
    const meta = await sharp(out).metadata()
    expect([meta.width, meta.height]).toEqual([1000, 1000])
  })

  it('con aspect 16/9 limita el ancho a 1600 y calcula el alto', async () => {
    const out = join(dir, 'out.webp')
    const result = await processImage(await makePng(2400, 1500), out, {
      aspect: 16 / 9,
      minWidth: 1280,
    })
    expect([result.width, result.height]).toEqual([1600, 900])
    expect(result.small).toBe(false)
  })

  it('avisa si el ancho queda por debajo del mínimo', async () => {
    const out = join(dir, 'out.webp')
    const result = await processImage(await makePng(1000, 1000), out, {
      aspect: 16 / 9,
      minWidth: 1280,
    })
    expect(result.width).toBe(1000)
    expect(result.small).toBe(true)
  })
})
