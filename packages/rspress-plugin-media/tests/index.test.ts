import { resolve } from 'node:path'

import { expect, it } from 'vite-plus/test'

import {
  parseMediaToml,
  pluginMedia,
  socialLinksFromMedia,
  socialLinksFromMediaTable,
  svgForSimpleIcon
} from '../src/index.ts'

const repoMedia = resolve(import.meta.dirname, '../../../personal/media.toml')

it('requires mediaPath', () => {
  expect(() => pluginMedia({ mediaPath: '' })).toThrow(/mediaPath/)
})

it('injects socialLinks in the config hook', async () => {
  const plugin = pluginMedia({ mediaPath: repoMedia })
  expect(plugin.name).toBe('@heyq02/rspress-plugin-media')
  const next = await plugin.config?.(
    { themeConfig: { darkMode: true } },
    {
      addPlugin() {},
      removePlugin() {},
      getI18nData: () => Promise.resolve({})
    },
    true
  )
  expect(next?.themeConfig?.darkMode).toBe(true)
  expect(next?.themeConfig?.socialLinks?.length).toBeGreaterThan(0)
  expect(next?.themeConfig?.socialLinks?.[0]?.icon).toEqual(
    expect.objectContaining({ svg: expect.stringContaining('<svg') })
  )
})

it('builds socialLinks from the repo media.toml with simple-icons SVGs', async () => {
  const links = await socialLinksFromMedia(repoMedia)
  expect(links.map(link => link.content)).toEqual([
    'https://github.com/heyq02',
    'https://space.bilibili.com/3493273159075938',
    'https://x.com/heyq02'
  ])
  expect(links.map(link => link.mode)).toEqual(['link', 'link', 'link'])
  for (const link of links) {
    expect(link.icon).toEqual({ svg: expect.stringContaining('fill="currentColor"') })
  }
})

it('skips hidden rows, missing icons, and empty urls', () => {
  const links = socialLinksFromMediaTable(
    parseMediaToml(`
[website]
name = "www"
url = "https://heyq02.com"
visible = true

[github]
name = "GitHub"
url = "https://github.com/heyq02"
visible = true
simpleicon = "github"

[qq]
name = "QQ"
url = ""
visible = false
simpleicon = "qq"

[hidden]
name = "Hidden"
url = "https://example.com"
visible = false
simpleicon = "x"
`)
  )
  expect(links).toHaveLength(1)
  expect(links[0]?.content).toBe('https://github.com/heyq02')
})

it('rejects unknown simpleicon slugs', () => {
  expect(() => svgForSimpleIcon('not-a-real-icon-slug-xyz')).toThrow(/unknown simpleicon/)
})
