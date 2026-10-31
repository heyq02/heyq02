import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { renderBlogMetaJson } from '../src/blog-posts.ts'
import { prepareBlogMeta, prepareBlogMetaOnce } from '../src/prepare.ts'

it('writes blog and posts _meta.json from post files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-meta-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: Demo\ndescription: Note\ndate: 2026-10-31\n---\n\n# Demo\n`
    )

    await prepareBlogMeta({ siteRoot: site, format: false })

    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('Demo')

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
