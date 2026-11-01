import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/shared/fs'
import type { SpawnFn } from '@heyq02/shared/fs'
import { fetchPinnedProjects } from 'rspress-plugin-github-pins'
import type { PinnedProject } from 'rspress-plugin-github-pins'

import { renderHomeMdx } from './profile-page.ts'

export interface PrepareProfileOptions {
  siteRoot: string
  format?: boolean
  fetchProjects?: () => Promise<PinnedProject[]>
  /** MDX import path for ProfilePlay (default `@theme/ProfilePlay`). */
  profilePlayModule?: string
  /** Test seam for `vp fmt`. */
  spawnFn?: SpawnFn
}

/** Regenerate `blogs/index.mdx` from intro + pinned projects. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const site = options.siteRoot
  const homeMdx = resolve(site, 'blogs/index.mdx')
  const projects = await (options.fetchProjects ?? fetchPinnedProjects)()
  const home = renderHomeMdx(projects, {
    profilePlayModule: options.profilePlayModule ?? '@theme/ProfilePlay'
  })
  const changed = await writeIfChanged(homeMdx, home)
  if (options.format && changed) {
    await formatGenerated(site, [homeMdx], options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareProfileOnce(options: PrepareProfileOptions): Promise<void> {
  prepareOnce ??= prepareProfile({ ...options, format: options.format ?? false })
  return prepareOnce
}
