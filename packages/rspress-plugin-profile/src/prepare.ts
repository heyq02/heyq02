import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/shared/fs'
import type { SpawnFn } from '@heyq02/shared/fs'
import { fetchPinnedProjects } from 'rspress-plugin-github-pins'
import type { PinnedProject } from 'rspress-plugin-github-pins'

import { renderHomeMdx } from './profile-page.ts'
import type { ProfileLang } from './profile-page.ts'

export interface PrepareProfileOptions {
  siteRoot: string
  format?: boolean
  fetchProjects?: () => Promise<PinnedProject[]>
  /** MDX import path for ProfilePlay (default `@theme/ProfilePlay`). */
  profilePlayModule?: string
  /** Test seam for `vp fmt`. */
  spawnFn?: SpawnFn
}

/** Languages that get a generated homepage (matches `locales` in rspress.config). */
export const PROFILE_LANGS: readonly ProfileLang[] = ['en', 'zh']

/** Regenerate `blogs/<lang>/index.mdx` from intro + pinned projects. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const site = options.siteRoot
  const projects = await (options.fetchProjects ?? fetchPinnedProjects)()
  const written: string[] = []
  let changed = false

  for (const lang of PROFILE_LANGS) {
    const homeMdx = resolve(site, 'blogs', lang, 'index.mdx')
    const home = renderHomeMdx(projects, {
      profilePlayModule: options.profilePlayModule ?? '@theme/ProfilePlay',
      lang
    })
    written.push(homeMdx)
    changed = (await writeIfChanged(homeMdx, home)) || changed
  }

  if (options.format && changed) {
    await formatGenerated(site, written, options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareProfileOnce(options: PrepareProfileOptions): Promise<void> {
  prepareOnce ??= prepareProfile({ ...options, format: options.format ?? false })
  return prepareOnce
}
