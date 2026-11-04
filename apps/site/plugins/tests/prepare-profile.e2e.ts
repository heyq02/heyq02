import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { prepareProfile } from '../index.ts'

it('profile e2e: writes one Chinese homepage with theme import and pins', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-e2e-profile-'))
  const site = join(root, 'apps/site')
  try {
    await mkdir(join(site, 'blogs'), { recursive: true })
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
    const home = await readFile(join(site, 'blogs/index.mdx'), 'utf8')
    expect(home).toContain('@theme/ProfilePlay')
    expect(home).toContain('e2e-repo')
    expect(home).toContain('教育经历')
    expect(home).not.toContain('profile-writing')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
