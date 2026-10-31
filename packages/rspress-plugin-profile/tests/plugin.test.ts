import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { pluginProfile } from '../src/index.ts'

it('exposes pluginProfile that writes homepage MDX via config hook', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-profile-plugin-'))
  const site = join(root, 'apps/site')

  try {
    await mkdir(join(site, 'blogs/blog/posts'), { recursive: true })
    await writeFile(
      join(site, 'blogs/blog/posts/demo.mdx'),
      `---\ntitle: Demo\ndate: 2026-10-31\n---\n\n# Demo\n`
    )

    const plugin = pluginProfile({
      siteRoot: site,
      format: false,
      profilePlayModule: '@theme/ProfilePlay',
      fetchProjects: () =>
        Promise.resolve([
          {
            name: 'simpleicons.dev',
            href: 'https://github.com/heyq02/simpleicons.dev',
            summary: 'Showcase',
            language: 'TypeScript',
            stars: 1,
            forks: 0
          }
        ])
    })
    expect(plugin.name).toBe('rspress-plugin-profile')
    const config = { root: site }
    await expect(plugin.config?.(config as never, {} as never, false)).resolves.toEqual(config)
    const home = await readFile(join(site, 'blogs/index.mdx'), 'utf8')
    expect(home).toContain('@theme/ProfilePlay')
    expect(home).toContain('simpleicons.dev')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
