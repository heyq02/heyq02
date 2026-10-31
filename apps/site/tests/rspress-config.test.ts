import { resolve } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

vi.mock('rspress-plugin-site-assets', () => ({
  pluginSiteAssets: () => ({ name: 'rspress-plugin-site-assets' })
}))
vi.mock('rspress-plugin-blog-meta', () => ({
  pluginBlogMeta: () => ({ name: 'rspress-plugin-blog-meta' })
}))
vi.mock('rspress-plugin-profile', () => ({
  pluginProfile: () => ({ name: 'rspress-plugin-profile' })
}))
vi.mock('@rspress/plugin-rss', () => ({
  pluginRss: () => ({ name: '@rspress/plugin-rss' })
}))

it('wires themeDir and compose plugins without side effects', async () => {
  const config = (await import('../rspress.config.ts')).default
  expect(config.themeDir).toBe(
    resolve(import.meta.dirname, '../../../packages/rspress-theme-heyq02')
  )
  expect(config.globalStyles).toBe(resolve(import.meta.dirname, '../tailwind.css'))
  expect(config.builderConfig?.plugins).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'rsbuild:tailwindcss' })])
  )
  expect(config.webMcp).toBe(true)
  expect(config.sitemap).toBe(true)
  expect(config.llms).toEqual(expect.objectContaining({ llmsTxt: expect.any(Function) }))
  expect(config.themeConfig?.fallbackHeadingTitle).toBe(false)
  expect(config.themeConfig?.lastUpdated).toBe(true)
  expect(config.themeConfig?.editLink?.docRepoBaseUrl).toContain('apps/site/blogs')
  expect(config.themeConfig?.llmsUI).toEqual(
    expect.objectContaining({ injectLlmsHint: true, viewOptions: false })
  )
  const names = (config.plugins ?? []).map(plugin => plugin.name)
  expect(names).toEqual(
    expect.arrayContaining([
      'rspress-plugin-site-assets',
      'rspress-plugin-blog-meta',
      'rspress-plugin-profile',
      '@rspress/plugin-rss'
    ])
  )
  expect(names).not.toContain('rspress-plugin-github-pins')
  expect(names).not.toContain('@rspress/plugin-sitemap')
})
