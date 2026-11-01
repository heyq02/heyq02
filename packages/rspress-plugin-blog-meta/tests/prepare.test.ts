import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { renderBlogMetaJson } from '../src/blog-posts.ts'
import { prepareBlogMeta, prepareBlogMetaOnce } from '../src/prepare.ts'

it('writes blog, posts, and interview _meta.json from markdown files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-meta-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await mkdir(join(site, 'blogs/blog/interview'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: Demo\ndescription: Note\ndate: 2026-10-31\n---\n\n# Demo\n`
    )
    await writeFile(
      join(site, 'blogs/blog/interview/daily-frontend-interview-2024-03-01.md'),
      `---\ntitle: Daily\ndate: 2024-03-01\n---\n\n# Daily\n`
    )

    await prepareBlogMeta({ siteRoot: site, format: false })

    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('Demo')
    expect(await readFile(join(site, 'blogs/blog/interview/_meta.json'), 'utf8')).toContain('Daily')

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
      `---\ntitle: Demo 2\ndate: 2026-10-31\n---\n\n# Demo 2\n`
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
