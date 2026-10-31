import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { renderBlogMetaJson } from '../src/blog-posts.ts'
import { prepareBlogMeta } from '../src/prepare.ts'

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
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
