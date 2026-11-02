import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

import { pluginBlogTranslate } from '../src/plugin.ts'

it('skips translation when no DeepSeek key is configured', async () => {
  const previous = process.env.DEEPSEEK_API_KEY
  delete process.env.DEEPSEEK_API_KEY
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    const plugin = pluginBlogTranslate({ siteRoot: '/nonexistent' })
    expect(plugin.name).toBe('rspress-plugin-blog-translate')
    const config = { root: '/nonexistent' }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('DEEPSEEK_API_KEY'))
  } finally {
    warn.mockRestore()
    if (previous !== undefined) {
      process.env.DEEPSEEK_API_KEY = previous
    }
  }
})

it('translates the blog when the key is present', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-plugin-'))
  const site = join(root, 'apps/site')
  const previous = {
    key: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    model: process.env.DEEPSEEK_MODEL
  }
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  const fetchMock = vi.fn(() =>
    Promise.resolve(Response.json({ choices: [{ message: { content: 'EN' } }] }))
  )
  vi.stubGlobal('fetch', fetchMock)

  try {
    await mkdir(join(site, 'blogs/zh/blog/posts'), { recursive: true })
    await writeFile(join(site, 'blogs/zh/blog/posts/demo.md'), '# 你好\n')
    process.env.DEEPSEEK_API_KEY = 'test-key'
    process.env.DEEPSEEK_BASE_URL = 'https://example.test/'
    process.env.DEEPSEEK_MODEL = 'custom-model'

    const plugin = pluginBlogTranslate({ siteRoot: site })
    const config = { root: site }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(expect.stringContaining('1/1 files translated'))
  } finally {
    log.mockRestore()
    vi.unstubAllGlobals()
    process.env.DEEPSEEK_API_KEY = previous.key
    if (previous.baseUrl === undefined) {
      delete process.env.DEEPSEEK_BASE_URL
    } else {
      process.env.DEEPSEEK_BASE_URL = previous.baseUrl
    }
    if (previous.model === undefined) {
      delete process.env.DEEPSEEK_MODEL
    } else {
      process.env.DEEPSEEK_MODEL = previous.model
    }
    await rm(root, { recursive: true, force: true })
  }
})
