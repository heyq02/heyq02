import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareSiteAssets } from '../src/index.ts'

it('site-assets e2e: copies signature and wechat into blogs/public', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-assets-'))
  const site = join(root, 'apps/site')
  const personalDir = join(root, 'personal')
  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(personalDir, { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat-e2e')
    await writeFile(join(site, 'public/wuxian-jinbu.png'), 'watermark-e2e')
    await writeFile(join(personalDir, 'signature.png'), 'png-e2e')
    await prepareSiteAssets({ siteRoot: site })
    expect(await readFile(join(site, 'blogs/public/favicon.png'), 'utf8')).toBe('png-e2e')
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat-e2e')
    expect(await readFile(join(site, 'blogs/public/wuxian-jinbu.png'), 'utf8')).toBe(
      'watermark-e2e'
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
