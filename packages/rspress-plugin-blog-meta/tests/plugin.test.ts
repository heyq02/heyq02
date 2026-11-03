import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { pluginBlogMeta, renderBlogMetaJson } from '../src/index.ts'

it('exposes pluginBlogMeta that writes meta via config hook', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-blog-plugin-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: 示例\ndate: 2026-10-31\n---\n\n# 示例\n`
    )

    const plugin = pluginBlogMeta({ siteRoot: site, format: false })
    expect(plugin.name).toBe('rspress-plugin-blog-meta')
    const config = { root: site }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)
    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('示例')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
