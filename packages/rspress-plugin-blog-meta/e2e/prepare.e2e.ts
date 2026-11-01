import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareBlogMeta, renderBlogMetaJson } from '../src/index.ts'

it('blog-meta e2e: writes sidebar meta from posts and interview', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-blog-'))
  const site = join(root, 'apps/site')
  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await mkdir(join(site, 'blogs/blog/interview'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/e2e.mdx'),
      `---\ntitle: E2E Post\ndate: 2026-10-31\n---\n\n# E2E\n`
    )
    await writeFile(
      join(site, 'blogs/blog/interview/e2e-interview.md'),
      `---\ntitle: E2E Interview\ndate: 2024-03-01\n---\n\n# Interview\n`
    )
    await prepareBlogMeta({ siteRoot: site, format: false })
    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('E2E Post')
    expect(await readFile(join(site, 'blogs/blog/interview/_meta.json'), 'utf8')).toContain(
      'E2E Interview'
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
