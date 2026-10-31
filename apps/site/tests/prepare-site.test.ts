import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { renderBlogMetaJson, renderPostsMetaJson } from '../src/blog-posts.ts'
import { prepareSite } from '../src/prepare-site.ts'

it('writes homepage MDX and blog meta from posts and pinned projects', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-prepare-'))
  const site = join(root, 'apps/site')
  const staticSig = join(root, 'static/signature')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await mkdir(join(site, 'public'), { recursive: true })
    await mkdir(staticSig, { recursive: true })
    await writeFile(join(site, 'public/wechat.jpg'), 'wechat')
    await writeFile(join(staticSig, 'full-nobg.ico'), 'ico')
    await writeFile(join(staticSig, 'full-nobg.png'), 'png')
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: Demo\ndescription: Note\ndate: 2026-10-31\n---\n\n# Demo\n`
    )

    await prepareSite({
      siteRoot: site,
      format: false,
      fetchProjects: () =>
        Promise.resolve([
          {
            name: 'simpleicons.dev',
            href: 'https://github.com/heyq02/simpleicons.dev',
            summary: 'Showcase your skills',
            language: 'TypeScript',
            stars: 172,
            forks: 0
          }
        ])
    })

    const home = await readFile(join(site, 'blogs/index.mdx'), 'utf8')
    expect(home).toContain('ProfilePlay')
    expect(home).toContain('simpleicons.dev')
    expect(home).toContain('Demo')
    expect(await readFile(join(site, 'blogs/blog/_meta.json'), 'utf8')).toBe(renderBlogMetaJson())
    expect(await readFile(join(site, 'blogs/blog/posts/_meta.json'), 'utf8')).toContain('Demo')
    expect(await readFile(join(site, 'blogs/public/wechat.jpg'), 'utf8')).toBe('wechat')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('keeps renderPostsMetaJson labels aligned with post titles', () => {
  const json = renderPostsMetaJson([
    {
      slug: 'demo',
      href: '/blog/posts/demo/',
      title: 'Demo post',
      description: '',
      date: '2026-10-31'
    }
  ])
  expect(JSON.parse(json)).toEqual([
    { type: 'file', name: 'demo', label: 'Demo post', overviewHeaders: [2] }
  ])
})
