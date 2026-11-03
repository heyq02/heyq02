import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareBlogMeta, renderBlogMetaJson } from '../src/index.ts'

it('blog-meta e2e: writes sidebar meta for the Chinese blog', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-blog-'))
  const site = join(root, 'apps/site')
  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await mkdir(join(site, 'blogs/blog/interview'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/e2e.mdx'),
      `---\ntitle: 端到端文章\ndate: 2026-10-31\n---\n\n# 端到端\n`
    )
    await writeFile(
      join(site, 'blogs/blog/interview/e2e-interview.md'),
      `---\ntitle: 端到端面经\ndate: 2024-03-01\n---\n\n# 面经\n`
    )
    await prepareBlogMeta({ siteRoot: site, format: false })

    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain(
      '端到端文章'
    )
    expect(await readFile(join(site, 'blogs/blog/interview/_meta.json'), 'utf8')).toContain(
      '端到端面经'
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
