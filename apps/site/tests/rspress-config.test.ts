import { resolve } from 'node:path'

import type { LlmsTxtContext, LlmsTxtPage, LlmsTxtRenderer } from '@rspress/core'
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
  pluginRss: () => [{ name: '@rspress/plugin-rss' }]
}))

async function loadConfig() {
  return (await import('../rspress.config.ts')).default
}

/** Minimal `llms.txt` context; only the fields the renderer reads are filled in. */
function llmsContext(overrides: Partial<LlmsTxtContext> = {}): LlmsTxtContext {
  return {
    title: 'Ari He｜阿瑞',
    description: '简介',
    lang: 'zh',
    version: '1.0.0',
    base: '/',
    siteOrigin: 'https://heyq02.com',
    sections: [],
    ...overrides
  }
}

/** Minimal page entry for the `llms.txt` section list. */
function llmsPage(overrides: Partial<LlmsTxtPage>): LlmsTxtPage {
  return {
    routePath: '/blog/posts/demo/',
    link: 'https://heyq02.com/blog/posts/demo/',
    title: '文章',
    frontmatter: {},
    lang: 'zh',
    version: '1.0.0',
    ...overrides
  }
}

/** `llms` may be a boolean in the public type; the site config uses the object form. */
function llmsTxtOf(config: Awaited<ReturnType<typeof loadConfig>>): LlmsTxtRenderer {
  expect(config.llms).toEqual(expect.objectContaining({ llmsTxt: expect.any(Function) }))
  return (config.llms as { llmsTxt: LlmsTxtRenderer }).llmsTxt
}

it('wires themeDir and compose plugins without side effects', async () => {
  const config = await loadConfig()
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
      'rspress-plugin-profile'
    ])
  )
  expect(names).not.toContain('rspress-plugin-blog-translate')
  expect(names).not.toContain('rspress-plugin-github-pins')
  expect(names).not.toContain('@rspress/plugin-sitemap')
})

it('declares a Chinese-only site without locales', async () => {
  const config = await loadConfig()
  expect(config.lang).toBe('zh')
  expect(config.locales).toBeUndefined()
  expect(config.route?.localeRedirect).toBeUndefined()
})

it('builds a Chinese llms.txt index', async () => {
  const text = await llmsTxtOf(await loadConfig())(
    llmsContext({
      sections: [{ title: '博客', pages: [llmsPage({})] }]
    })
  )

  expect(text).toContain('# Ari He｜阿瑞')
  expect(text).toContain('## 从这里开始')
  expect(text).toContain('## 页面')
  expect(text).toContain('[文章](https://heyq02.com/blog/posts/demo/)')
  expect(text).not.toContain('Start here')
})

it('falls back to placeholder copy when no pages exist', async () => {
  const text = await llmsTxtOf(await loadConfig())(llmsContext({ siteOrigin: undefined }))

  expect(text).toContain('https://heyq02.com/index.md')
  expect(text).toContain('-（暂无其他页面）')
})
