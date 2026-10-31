import { resolve } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

vi.mock('rspress-plugin-site-assets', () => ({
  pluginSiteAssets: () => ({ name: 'rspress-plugin-site-assets' })
}))
vi.mock('rspress-plugin-github-pins', () => ({
  pluginGithubPins: () => ({ name: 'rspress-plugin-github-pins' })
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
vi.mock('@rspress/plugin-sitemap', () => ({
  pluginSitemap: () => ({ name: '@rspress/plugin-sitemap' })
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
  const names = (config.plugins ?? []).map(plugin => plugin.name)
  expect(names).toEqual(
    expect.arrayContaining([
      'rspress-plugin-site-assets',
      'rspress-plugin-github-pins',
      'rspress-plugin-blog-meta',
      'rspress-plugin-profile',
      '@rspress/plugin-sitemap',
      '@rspress/plugin-rss'
    ])
  )
})
