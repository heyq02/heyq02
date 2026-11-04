import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

vi.mock('../github-pinned.ts', () => ({
  fetchPinnedProjects: () =>
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
}))

const { pluginProfile } = await import('../index.ts')

it('registers the profile plugin and writes the homepage through the config hook', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-plugin-profile-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs'), { recursive: true })

    const plugin = pluginProfile(site)
    expect(plugin.name).toBe('rspress-plugin-profile')

    const config = { root: site }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)

    const home = await readFile(join(site, 'blogs/index.mdx'), 'utf8')
    expect(home).toContain('@theme/ProfilePlay')
    expect(home).toContain('simpleicons.dev')
    expect(home).toContain('>教育经历</h2>')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
