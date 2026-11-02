import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareProfile } from '../src/index.ts'

it('profile e2e: writes both language homepages with theme import and pins', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-profile-'))
  const site = join(root, 'apps/site')
  try {
    await mkdir(join(site, 'blogs/en'), { recursive: true })
    await mkdir(join(site, 'blogs/zh'), { recursive: true })
    await prepareProfile({
      siteRoot: site,
      format: false,
      fetchProjects: () =>
        Promise.resolve([
          {
            name: 'e2e-repo',
            href: 'https://github.com/heyq02/e2e-repo',
            summary: 'e2e',
            language: 'TypeScript',
            stars: 1,
            forks: 0
          }
        ])
    })
    const en = await readFile(join(site, 'blogs/en/index.mdx'), 'utf8')
    const zh = await readFile(join(site, 'blogs/zh/index.mdx'), 'utf8')
    expect(en).toContain('@theme/ProfilePlay')
    expect(en).toContain('e2e-repo')
    expect(zh).toContain('e2e-repo')
    expect(zh).toContain('教育经历')
    expect(en).not.toContain('profile-writing')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
