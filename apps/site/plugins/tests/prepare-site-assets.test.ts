import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareSiteAssets } from '../prepare-site-assets.ts'

it('copies signature, wechat, and watermark into blogs/public', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-assets-'))
  const site = join(root, 'apps/site')
  const personalDir = join(root, 'personal')

  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(personalDir, { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat')
    await writeFile(join(site, 'public/wuxian-jinbu.png'), 'watermark')
    await writeFile(join(personalDir, 'signature.png'), 'png')

    await prepareSiteAssets({ siteRoot: site })

    expect(await readFile(join(site, 'blogs/public/favicon.png'), 'utf8')).toBe('png')
    expect(await readFile(join(site, 'blogs/public/signature.png'), 'utf8')).toBe('png')
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat')
    expect(await readFile(join(site, 'blogs/public/wuxian-jinbu.png'), 'utf8')).toBe('watermark')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
