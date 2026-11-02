import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareProfile, prepareProfileOnce } from '../src/prepare.ts'

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

it('writes homepage MDX for every language from pinned projects', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-profile-'))
  const site = join(root, 'apps/site')

  try {
    for (const lang of ['en', 'zh']) {
      await mkdir(join(site, `blogs/${lang}`), { recursive: true })
    }

    await prepareProfile({
      siteRoot: site,
      format: false,
      profilePlayModule: '@theme/ProfilePlay',
      fetchProjects
    })

    const en = await readFile(join(site, 'blogs/en/index.mdx'), 'utf8')
    expect(en).toContain('ProfilePlay')
    expect(en).toContain("from '@theme/ProfilePlay'")
    expect(en).toContain('simpleicons.dev')
    expect(en).toContain('>Education</h2>')
    expect(en).not.toContain('profile-writing')

    const zh = await readFile(join(site, 'blogs/zh/index.mdx'), 'utf8')
    expect(zh).toContain('>教育经历</h2>')
    expect(zh).toContain('simpleicons.dev')

    const { EventEmitter } = await import('node:events')
    let formatted = false
    const spawnFn = (() => {
      const child = new EventEmitter()
      queueMicrotask(() => {
        formatted = true
        child.emit('exit', 0)
      })
      return child
    }) as never

    await prepareProfile({
      siteRoot: site,
      format: true,
      profilePlayModule: '@theme/ProfilePlay',
      fetchProjects,
      spawnFn
    })
    expect(formatted).toBe(false)

    await writeFile(join(site, 'blogs/en/index.mdx'), `${en}\n`)
    await prepareProfile({
      siteRoot: site,
      format: true,
      profilePlayModule: '@theme/ProfilePlay',
      fetchProjects,
      spawnFn
    })
    expect(formatted).toBe(true)

    await prepareProfile({ siteRoot: site, fetchProjects })
    await prepareProfileOnce({ siteRoot: site, format: false, fetchProjects })
    await prepareProfileOnce({ siteRoot: site, format: false, fetchProjects })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('defaults the ProfilePlay module and format flag', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-profile-defaults-'))
  const site = join(root, 'apps/site')
  try {
    for (const lang of ['en', 'zh']) {
      await mkdir(join(site, `blogs/${lang}`), { recursive: true })
    }
    // No profilePlayModule and no format: both fall back to defaults.
    await prepareProfile({ siteRoot: site, fetchProjects })
    const home = await readFile(join(site, 'blogs/en/index.mdx'), 'utf8')
    expect(home).toContain("from '@theme/ProfilePlay'")
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
