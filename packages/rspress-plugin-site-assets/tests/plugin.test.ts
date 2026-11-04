import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { pluginSiteAssets } from '../src/index.ts'

it('exposes pluginSiteAssets that copies public assets via config hook', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-assets-plugin-'))
  const site = join(root, 'apps/site')
  const personalDir = join(root, 'personal')

  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(personalDir, { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat')
    await writeFile(join(site, 'public/wuxian-jinbu.png'), 'watermark')
    await writeFile(join(personalDir, 'signature.png'), 'png')

    const plugin = pluginSiteAssets({ siteRoot: site })
    expect(plugin.name).toBe('rspress-plugin-site-assets')
    const config = { root: site }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat')
    expect(await readFile(join(site, 'blogs/public/wuxian-jinbu.png'), 'utf8')).toBe('watermark')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
