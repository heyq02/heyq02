import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { pluginSiteAssets } from '../index.ts'
import { prepareSiteAssetsOnce } from '../prepare-site-assets.ts'

it('registers the site-assets plugin and copies assets through the config hook', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-plugin-assets-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(join(root, 'personal'), { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat')
    await writeFile(join(site, 'public/wuxian-jinbu.png'), 'watermark')
    await writeFile(join(root, 'personal/signature.png'), 'png')

    const plugin = pluginSiteAssets(site)
    expect(plugin.name).toBe('rspress-plugin-site-assets')

    const config = { root: site }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat')
    expect(await readFile(join(site, 'blogs/public/wuxian-jinbu.png'), 'utf8')).toBe('watermark')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('prepares assets only once per process', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-plugin-assets-once-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(join(root, 'personal'), { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat')
    await writeFile(join(site, 'public/wuxian-jinbu.png'), 'watermark')
    await writeFile(join(root, 'personal/signature.png'), 'png')

    const first = prepareSiteAssetsOnce({ siteRoot: site })
    const second = prepareSiteAssetsOnce({ siteRoot: site })
    expect(first).toBe(second)
    await first
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
