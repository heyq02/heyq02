import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareBlogMeta, renderBlogMetaJson } from '../src/index.ts'

it('blog-meta e2e: writes sidebar meta from posts', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-blog-'))
  const site = join(root, 'apps/site')
  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/e2e.mdx'),
      `---\ntitle: E2E Post\ndate: 2026-10-31\n---\n\n# E2E\n`
    )
    await prepareBlogMeta({ siteRoot: site, format: false })
    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('E2E Post')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
