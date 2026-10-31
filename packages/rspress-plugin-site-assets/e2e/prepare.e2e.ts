import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareSiteAssets } from '../src/index.ts'

it('site-assets e2e: copies signature and wechat into blogs/public', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-assets-'))
  const site = join(root, 'apps/site')
  const staticSig = join(root, 'static/signature')
  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(staticSig, { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat-e2e')
    await writeFile(join(staticSig, 'full-nobg.ico'), 'ico-e2e')
    await writeFile(join(staticSig, 'full-nobg.png'), 'png-e2e')
    await prepareSiteAssets({ siteRoot: site })
    expect(await readFile(join(site, 'blogs/public/favicon.ico'), 'utf8')).toBe('ico-e2e')
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat-e2e')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
