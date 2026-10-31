import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareSiteAssets } from '../src/prepare.ts'

it('copies favicon, signature, and wechat into blogs/public', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-assets-'))
  const site = join(root, 'apps/site')
  const staticSig = join(root, 'static/signature')

  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(staticSig, { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat')
    await writeFile(join(staticSig, 'full-nobg.ico'), 'ico')
    await writeFile(join(staticSig, 'full-nobg.png'), 'png')

    await prepareSiteAssets({ siteRoot: site })

    expect(await readFile(join(site, 'blogs/public/favicon.ico'), 'utf8')).toBe('ico')
    expect(await readFile(join(site, 'blogs/public/favicon.png'), 'utf8')).toBe('png')
    expect(await readFile(join(site, 'blogs/public/signature.png'), 'utf8')).toBe('png')
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
