import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { renderBlogMetaJson } from '../src/blog-posts.ts'
import { prepareBlogMeta, prepareBlogMetaOnce } from '../src/prepare.ts'

it('writes blog, posts, and interview _meta.json', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-meta-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await mkdir(join(site, 'blogs/blog/interview'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: 示例文章\ndescription: 笔记\ndate: 2026-10-31\n---\n\n# 示例\n`
    )
    await writeFile(
      join(site, 'blogs/blog/interview/daily-frontend-interview-2024-03-01.md'),
      `---\ntitle: 每日面经\ndate: 2024-03-01\n---\n\n# 每日\n`
    )

    await prepareBlogMeta({ siteRoot: site, format: false })

    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('示例文章')
    expect(await readFile(join(site, 'blogs/blog/interview/_meta.json'), 'utf8')).toContain(
      '每日面经'
    )

    const { EventEmitter } = await import('node:events')
    let formatted = false
    await prepareBlogMeta({
      siteRoot: site,
      format: true,
      spawnFn: (() => {
        const child = new EventEmitter()
        queueMicrotask(() => {
          formatted = true
          child.emit('exit', 0)
        })
        return child
      }) as never
    })
    // Unchanged content → format skipped
    expect(formatted).toBe(false)

    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: 示例 2\ndate: 2026-10-31\n---\n\n# 示例 2\n`
    )
    await prepareBlogMeta({
      siteRoot: site,
      format: true,
      spawnFn: (() => {
        const child = new EventEmitter()
        queueMicrotask(() => {
          formatted = true
          child.emit('exit', 0)
        })
        return child
      }) as never
    })
    expect(formatted).toBe(true)

    await prepareBlogMetaOnce({ siteRoot: site, format: false })
    await prepareBlogMetaOnce({ siteRoot: site, format: false })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('defaults the format flag when omitted', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-meta-default-'))
  const site = join(root, 'apps/site')
  try {
    await prepareBlogMeta({ siteRoot: site })
    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
