import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { translateBlogSite } from '../src/translate-blog-site.ts'
import {
  blogRoots,
  contentHash,
  splitFrontmatter,
  translateBlog,
  translateMarkdown
} from '../src/translate.ts'

const fakeTranslate = (text: string) => Promise.resolve(`EN:${text}`)

it('translates the body and keeps frontmatter and code blocks', async () => {
  const source = `---\ntitle: 中文标题\ndate: 2024-03-01\n---\n\n# 标题\n\n正文\n\n\`\`\`js\nconst a = 1\n\`\`\`\n`
  const output = await translateMarkdown(source, fakeTranslate)
  expect(output.startsWith('---\ntitle: 中文标题\ndate: 2024-03-01\n---\n')).toBe(true)
  expect(output).toContain('EN:# 标题')
  expect(output).toContain('const a = 1')
  expect(output).not.toContain('⟦CODE_')
  expect(output.endsWith('\n')).toBe(true)
})

it('handles documents without frontmatter', () => {
  expect(splitFrontmatter('# hi')).toEqual({ frontmatter: '', body: '# hi' })
  expect(splitFrontmatter('---\nunclosed\n')).toEqual({ frontmatter: '', body: '---\nunclosed\n' })
})

it('hashes content deterministically', () => {
  expect(contentHash('abc')).toBe(contentHash('abc'))
  expect(contentHash('abc')).not.toBe(contentHash('abd'))
  expect(contentHash('')).toContain('-0')
})

it('writes translations and skips unchanged sources on the next run', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-'))
  const sourceRoot = join(root, 'zh')
  const targetRoot = join(root, 'en')
  const cacheFile = join(root, 'cache.json')
  try {
    await mkdir(join(sourceRoot, 'blog/posts'), { recursive: true })
    await writeFile(join(sourceRoot, 'blog/posts/demo.md'), '# 你好\n')

    let calls = 0
    const translate = (text: string) => {
      calls += 1
      return Promise.resolve(`EN:${text}`)
    }
    const site = join(root, 'apps/site')
    await mkdir(join(site, 'blogs'), { recursive: true })
    await mkdir(join(site, 'blogs/zh/blog/posts'), { recursive: true })
    await writeFile(join(site, 'blogs/zh/blog/posts/demo.md'), '# 你好\n')

    await expect(translateBlog({ sourceRoot, targetRoot, translate })).resolves.toMatchObject({
      files: [{ path: 'blog/posts/demo.md', translated: true }]
    })
    expect(await readFile(join(targetRoot, 'blog/posts/demo.md'), 'utf8')).toContain('EN:# 你好')
    expect(calls).toBe(1)

    const first = await translateBlogSite({ siteRoot: site, translate, cacheFile })
    expect(first.files[0]?.translated).toBe(true)
    const second = await translateBlogSite({ siteRoot: site, translate, cacheFile })
    expect(second.files[0]?.translated).toBe(false)
    expect(calls).toBe(2)

    await writeFile(join(site, 'blogs/zh/blog/posts/demo.md'), '# 再见\n')
    const third = await translateBlogSite({ siteRoot: site, translate, cacheFile })
    expect(third.files[0]?.translated).toBe(true)
    expect(calls).toBe(3)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('copies oversized files instead of translating them', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-big-'))
  const sourceRoot = join(root, 'zh')
  const targetRoot = join(root, 'en')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'big.md'), `# 大文件\n${'x'.repeat(200)}`)

    let calls = 0
    const result = await translateBlog({
      sourceRoot,
      targetRoot,
      translate: text => {
        calls += 1
        return Promise.resolve(text)
      },
      maxFileBytes: 50
    })
    expect(result.files[0]?.translated).toBe(false)
    expect(calls).toBe(0)
    expect(await readFile(join(targetRoot, 'big.md'), 'utf8')).toContain('# 大文件')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('returns an empty result when the source tree is missing', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-empty-'))
  try {
    await expect(
      translateBlog({
        sourceRoot: join(root, 'nope'),
        targetRoot: join(root, 'en'),
        translate: fakeTranslate
      })
    ).resolves.toEqual({ files: [], cache: {}, failures: [] })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('maps the site root to zh and en blog trees', () => {
  expect(blogRoots('/srv/site')).toEqual({
    sourceRoot: '/srv/site/blogs/zh',
    targetRoot: '/srv/site/blogs/en'
  })
})

it('rethrows non-ENOENT directory errors', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-enotdir-'))
  try {
    const file = join(root, 'not-a-dir')
    await writeFile(file, 'x')
    await expect(
      translateBlog({ sourceRoot: file, targetRoot: join(root, 'en'), translate: fakeTranslate })
    ).rejects.toThrow(/ENOTDIR|ENOENT|EISDIR|ENOTSUP|EINVAL/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('treats a directory-less source path as empty', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-missing-'))
  try {
    const result = await translateBlog({
      sourceRoot: join(root, 'missing'),
      targetRoot: join(root, 'en'),
      translate: fakeTranslate
    })
    expect(result).toEqual({ files: [], cache: {}, failures: [] })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('reuses an unchanged translation without calling the translator', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-cache-hit-'))
  const sourceRoot = join(root, 'zh')
  const targetRoot = join(root, 'en')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'a.md'), '# A\n')
    const first = await translateBlog({ sourceRoot, targetRoot, translate: fakeTranslate })
    const second = await translateBlog({
      sourceRoot,
      targetRoot,
      translate: () => Promise.reject(new Error('cached run must not translate')),
      cache: first.cache
    })
    expect(second.files[0]?.translated).toBe(false)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('re-translates when the cache entry is stale but the file exists', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-stale-'))
  const sourceRoot = join(root, 'zh')
  const targetRoot = join(root, 'en')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'a.md'), '# A\n')
    let calls = 0
    const result = await translateBlog({
      sourceRoot,
      targetRoot,
      cache: { 'a.md': 'stale-hash' },
      translate: text => {
        calls += 1
        return Promise.resolve(`EN:${text}`)
      }
    })
    expect(calls).toBe(1)
    expect(result.files[0]?.translated).toBe(true)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('re-translates when the cached hash matches but the target file is gone', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-gone-'))
  const sourceRoot = join(root, 'zh')
  const targetRoot = join(root, 'en')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'a.md'), '# A\n')
    const first = await translateBlog({ sourceRoot, targetRoot, translate: fakeTranslate })
    await rm(join(targetRoot, 'a.md'))
    const second = await translateBlog({
      sourceRoot,
      targetRoot,
      cache: first.cache,
      translate: fakeTranslate
    })
    expect(second.files[0]?.translated).toBe(true)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('hashes text without surrogate pairs and empty strings', () => {
  expect(contentHash('')).toBe(contentHash(''))
  expect(contentHash('a😀b')).not.toBe(contentHash('ab'))
})

it('rethrows when a nested source entry cannot be read as a directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-notdir-nested-'))
  const sourceRoot = join(root, 'zh')
  try {
    await mkdir(join(sourceRoot, 'file.md'), { recursive: true })
    await expect(
      translateBlog({ sourceRoot, targetRoot: join(root, 'en'), translate: fakeTranslate })
    ).resolves.toMatchObject({ files: [] })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('retries a chunk that drops a code placeholder', async () => {
  const calls: string[] = []
  const translate = (text: string) => {
    calls.push(text)
    return Promise.resolve(calls.length === 1 ? '正文' : '正文 ⟦CODE_0⟧')
  }
  const output = await translateMarkdown('正文\n\n```js\n1\n```\n', translate)
  expect(calls).toHaveLength(2)
  expect(calls[1]).toContain('previous answer was wrong')
  expect(output).toContain('```js')
})

it('fails when a chunk never keeps its placeholders', async () => {
  const translate = () => Promise.resolve('no placeholders here')
  await expect(translateMarkdown('正文\n\n```js\n1\n```\n', translate)).rejects.toThrow(
    /dropping code placeholders/
  )
})

it('keeps other files when one translation fails', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-partial-'))
  const sourceRoot = join(root, 'zh')
  const targetRoot = join(root, 'en')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'good.md'), '# 好\n')
    await writeFile(join(sourceRoot, 'bad.md'), '正文\n\n```js\n1\n```\n')

    const result = await translateBlog({
      sourceRoot,
      targetRoot,
      translate: text => Promise.resolve(text.includes('⟦CODE_') ? 'dropped' : `EN:${text}`)
    })

    expect(result.files.map(file => file.path)).toEqual(['good.md'])
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0]?.path).toBe('bad.md')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('retries when the model reorders placeholders', async () => {
  const calls: string[] = []
  const translate = (text: string) => {
    calls.push(text)
    return Promise.resolve(calls.length === 1 ? '⟦CODE_1⟧ ⟦CODE_0⟧' : '⟦CODE_0⟧ ⟦CODE_1⟧')
  }
  await translateMarkdown('a\n\n```js\n1\n```\n\nb\n\n```js\n2\n```\n', translate)
  expect(calls).toHaveLength(2)
})

it('retries when the model invents an extra placeholder', async () => {
  const calls: string[] = []
  const translate = () => {
    calls.push('x')
    return Promise.resolve(calls.length === 1 ? '⟦CODE_0⟧ ⟦CODE_5⟧' : '⟦CODE_0⟧')
  }
  const output = await translateMarkdown('a\n\n```js\n1\n```\n', translate)
  expect(calls).toHaveLength(2)
  expect(output).toContain('```js')
})

it('uses maxFileBytes defaults when the option is omitted', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-default-limit-'))
  const sourceRoot = join(root, 'zh')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'small.md'), '# 小\n')
    const result = await translateBlog({
      sourceRoot,
      targetRoot: join(root, 'en'),
      translate: fakeTranslate
    })
    expect(result.files[0]?.translated).toBe(true)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('reports a non-Error failure as a string message', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-translate-throw-'))
  const sourceRoot = join(root, 'zh')
  try {
    await mkdir(sourceRoot, { recursive: true })
    await writeFile(join(sourceRoot, 'boom.md'), '# 炸\n')
    const result = await translateBlog({
      sourceRoot,
      targetRoot: join(root, 'en'),
      // oxlint-disable-next-line typescript/prefer-promise-reject-errors
      translate: () => Promise.reject('nope')
    })
    expect(result.failures[0]).toEqual({ path: 'boom.md', message: 'nope' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('keeps a frontmatter-only page as-is without calling the model', async () => {
  const calls: string[] = []
  const source = '---\noverview: true\ntitle: Blog\n---\n'
  const output = await translateMarkdown(source, text => {
    calls.push(text)
    return Promise.resolve('invented ⟦CODE_0⟧')
  })
  expect(calls).toHaveLength(0)
  expect(output).toBe('---\noverview: true\ntitle: Blog\n---\n')
})

it('handles a completely empty document', async () => {
  await expect(translateMarkdown('', fakeTranslate)).resolves.toBe('\n')
})
