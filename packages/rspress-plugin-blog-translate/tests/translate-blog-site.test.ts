import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

import { translateBlogSite, translateBlogWithEnv } from '../src/translate-blog-site.ts'

it('reads and writes the incremental cache file', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-site-'))
  const site = join(root, 'apps/site')
  const cacheFile = join(root, 'cache.json')
  try {
    await mkdir(join(site, 'blogs/zh/blog/posts'), { recursive: true })
    await writeFile(join(site, 'blogs/zh/blog/posts/demo.md'), '# 你好\n')

    const first = await translateBlogSite({
      siteRoot: site,
      cacheFile,
      translate: text => Promise.resolve(`EN:${text}`)
    })
    expect(first.files[0]?.translated).toBe(true)
    expect(JSON.parse(await readFile(cacheFile, 'utf8'))).toHaveProperty('blog/posts/demo.md')

    const second = await translateBlogSite({
      siteRoot: site,
      cacheFile,
      translate: () => Promise.reject(new Error('should not be called'))
    })
    expect(second.files[0]?.translated).toBe(false)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('treats a corrupt cache file as empty', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-badcache-'))
  const site = join(root, 'apps/site')
  const cacheFile = join(root, 'cache.json')
  try {
    await mkdir(join(site, 'blogs/zh'), { recursive: true })
    await writeFile(cacheFile, 'not json')
    await expect(
      translateBlogSite({
        siteRoot: site,
        cacheFile,
        translate: text => Promise.resolve(text)
      })
    ).resolves.toEqual({ files: [], cache: {} })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('requires a DeepSeek key in the environment', async () => {
  const previous = process.env.DEEPSEEK_API_KEY
  delete process.env.DEEPSEEK_API_KEY
  try {
    await expect(translateBlogWithEnv('/nonexistent')).rejects.toThrow(/DEEPSEEK_API_KEY/)
  } finally {
    if (previous !== undefined) {
      process.env.DEEPSEEK_API_KEY = previous
    }
  }
})

it('falls back to the default endpoint and model when env overrides are empty', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-env-'))
  const site = join(root, 'apps/site')
  const previous = {
    key: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    model: process.env.DEEPSEEK_MODEL
  }
  const calls: string[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      calls.push(url)
      return Promise.resolve(Response.json({ choices: [{ message: { content: 'EN' } }] }))
    })
  )
  try {
    await mkdir(join(site, 'blogs/zh/blog/posts'), { recursive: true })
    await writeFile(join(site, 'blogs/zh/blog/posts/demo.md'), '# 你好\n')
    process.env.DEEPSEEK_API_KEY = 'k'
    delete process.env.DEEPSEEK_BASE_URL
    delete process.env.DEEPSEEK_MODEL

    await expect(translateBlogWithEnv(site)).resolves.toMatchObject({
      files: [{ translated: true }]
    })
    expect(calls[0]).toBe('https://api.deepseek.com/chat/completions')
  } finally {
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
