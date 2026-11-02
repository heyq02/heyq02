import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { renderBlogMetaJson } from '../src/blog-posts.ts'
import { prepareBlogMeta, prepareBlogMetaOnce } from '../src/prepare.ts'

it('writes blog, posts, and interview _meta.json for both languages', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-meta-'))
  const site = join(root, 'apps/site')

  try {
    for (const lang of ['en', 'zh']) {
      await mkdir(join(site, `blogs/${lang}/blog/posts`), { recursive: true })
      await mkdir(join(site, `blogs/${lang}/blog/interview`), { recursive: true })
      await writeFile(
        join(site, `blogs/${lang}/blog/posts/demo.mdx`),
        `---\ntitle: Demo ${lang}\ndescription: Note\ndate: 2026-10-31\n---\n\n# Demo\n`
      )
      await writeFile(
        join(site, `blogs/${lang}/blog/interview/daily-frontend-interview-2024-03-01.md`),
        `---\ntitle: Daily ${lang}\ndate: 2024-03-01\n---\n\n# Daily\n`
      )
    }

    await prepareBlogMeta({ siteRoot: site, format: false })

    for (const lang of ['en', 'zh']) {
      expect(await readFile(join(site, `blogs/${lang}/blog/_meta.json`), 'utf8')).toBe(
        renderBlogMetaJson(lang as 'en' | 'zh')
      )
      expect(await readFile(join(site, `blogs/${lang}/blog/posts/_meta.json`), 'utf8')).toContain(
        `Demo ${lang}`
      )
      expect(
        await readFile(join(site, `blogs/${lang}/blog/interview/_meta.json`), 'utf8')
      ).toContain(`Daily ${lang}`)
    }

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
      join(site, 'blogs/en/blog/posts/demo.mdx'),
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

it('defaults the format flag when omitted', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-meta-default-'))
  const site = join(root, 'apps/site')
  try {
    await prepareBlogMeta({ siteRoot: site })
    expect(await readFile(join(site, 'blogs/zh/blog/_meta.json'), 'utf8')).toBe(
      renderBlogMetaJson('zh')
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
