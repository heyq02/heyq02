import { resolve } from 'node:path'

import { formatGenerated } from './format-generated.ts'
import type { SpawnFn } from './format-generated.ts'
import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
import type { Intro } from './intro.ts'
import { renderHomeMdx } from './profile-page.ts'
import { writeIfChanged } from './write-if-changed.ts'

export interface PrepareProfileOptions {
  siteRoot: string
  intro: Intro
  format?: boolean
  fetchProjects?: () => Promise<PinnedProject[]>
  /** MDX import path for ProfilePlay (default `@theme/ProfilePlay`). */
  profilePlayModule?: string
  spawnFn?: SpawnFn
}

/** Regenerate `blogs/index.mdx` from intro + pinned projects. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const homeMdx = resolve(options.siteRoot, 'blogs', 'index.mdx')
  const projects = await (options.fetchProjects ?? (() => fetchPinnedProjects(options.intro)))()
  const home = renderHomeMdx(options.intro, projects, {
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
