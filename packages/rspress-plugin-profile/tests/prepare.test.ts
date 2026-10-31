import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareProfile, prepareProfileOnce } from '../src/prepare.ts'

it('writes homepage MDX from posts and pinned projects', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-profile-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: Demo\ndescription: Note\ndate: 2026-10-31\n---\n\n# Demo\n`
    )

    await prepareProfile({
      siteRoot: site,
      format: false,
      profilePlayModule: '@theme/ProfilePlay',
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
    expect(home).toContain("from '@theme/ProfilePlay'")
    expect(home).toContain('simpleicons.dev')
    expect(home).toContain('Demo')

    const { EventEmitter } = await import('node:events')
    let formatted = false
    const fetchProjects = () =>
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
    await prepareProfile({
      siteRoot: site,
      format: true,
      profilePlayModule: '@theme/ProfilePlay',
      fetchProjects,
      spawnFn: (() => {
        const child = new EventEmitter()
        queueMicrotask(() => {
          formatted = true
          child.emit('exit', 0)
        })
        return child
      }) as never
    })
    expect(formatted).toBe(false)

    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: Demo 2\ndate: 2026-10-31\n---\n\n# Demo 2\n`
    )
    await prepareProfile({
      siteRoot: site,
      format: true,
      profilePlayModule: '@theme/ProfilePlay',
      fetchProjects,
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

    await prepareProfile({
      siteRoot: site,
      fetchProjects
    })
    await prepareProfileOnce({ siteRoot: site, format: false, fetchProjects })
    await prepareProfileOnce({ siteRoot: site, format: false, fetchProjects })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
