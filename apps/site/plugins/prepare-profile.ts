import { resolve } from 'node:path'

import { formatGenerated } from '../lib/format-generated.ts'
import type { SpawnFn } from '../lib/format-generated.ts'
import { writeIfChanged } from '../lib/write-if-changed.ts'
import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
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
  const homeMdx = resolve(options.siteRoot, 'blogs', 'index.mdx')
  const projects = await (options.fetchProjects ?? fetchPinnedProjects)()
  const home = renderHomeMdx(projects, {
    profilePlayModule: options.profilePlayModule ?? '@theme/ProfilePlay'
  })

  const changed = await writeIfChanged(homeMdx, home)
  if (options.format && changed) {
    await formatGenerated(options.siteRoot, [homeMdx], options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareProfileOnce(options: PrepareProfileOptions): Promise<void> {
  prepareOnce ??= prepareProfile({ ...options, format: options.format ?? false })
  return prepareOnce
}
