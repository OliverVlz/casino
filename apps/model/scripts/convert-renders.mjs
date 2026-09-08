import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
const require = createRequire(
  new URL('../../control-plane/package.json', import.meta.url),
)
const sharp = require('sharp')
const root = path.resolve(import.meta.dirname, '../public/renders')
const provenance = []
for (const dir of await readdir(root)) {
  if (!(await stat(path.join(root, dir))).isDirectory()) continue
  for (const name of await readdir(path.join(root, dir))) {
    if (!name.endsWith('.png')) continue
    const source = path.join(root, dir, name)
    const base = source.slice(0, -4)
    const pixels = dir === 'hero' ? 1024 : 640
    await sharp(source)
      .resize(pixels)
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(base + '.webp')
    await sharp(source)
      .resize(pixels)
      .avif({ quality: 65, effort: 4 })
      .toFile(base + '.avif')
    const metadata = await sharp(base + '.webp').metadata()
    if (!metadata.hasAlpha) throw new Error(`Missing alpha in ${base}`)
    const origin = `Original procedural Blender render by MODEL Studio. Generator: apps/model/assets/casino_asset_generator.py, stage all, Blender 5.2 Cycles 32 samples, product studio with transparent film. Source: ${dir}/${name}. Web derivatives: sharp resize ${pixels}px, WebP quality 88 / AVIF quality 65. No stock imagery or generative image prompt.`
    const embed = path.resolve(import.meta.dirname, '../../../.agents/skills/impeccable/scripts/embed-prompt.mjs')
    for (const raster of [source, base + '.webp', base + '.avif']) {
      const result = spawnSync(process.execPath, [embed, raster, '--prompt', origin], { encoding: 'utf8' })
      if (result.status !== 0) throw new Error(result.stderr || 'Failed to embed raster provenance')
    }
    provenance.push({
      source: `${dir}/${name}`,
      outputs: ['webp', 'avif'].map(
        (ext) => `${dir}/${name.slice(0, -4)}.${ext}`,
      ),
      width: pixels,
      height: pixels,
      alpha: true,
      author: 'MODEL procedural Blender generator',
      generator: '../../assets/casino_asset_generator.py',
    })
  }
}
await writeFile(
  path.join(root, 'provenance.json'),
  JSON.stringify(provenance, null, 2) + '\n',
)
console.log(
  `Converted ${provenance.length} original Blender renders to WebP and AVIF with alpha.`,
)
