import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { SpawnFn } from '@heyq02/rspress-plugin-utils'

import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
import type { Intro } from './intro.ts'
import { profilePage, renderHomeMdx, renderProfileDataModule } from './profile-page.ts'

export interface PrepareProfileOptions {
  siteRoot: string
  intro: Intro
  format?: boolean
  fetchProjects?: () => Promise<PinnedProject[]>
  spawnFn?: SpawnFn
}

/** Regenerate homepage shell + pinned-project data for `@theme/ProfilePage`. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const homeMdx = resolve(options.siteRoot, 'blogs', 'index.mdx')
  const profileData = resolve(options.siteRoot, 'theme', 'profile-data.ts')
  const projects = await (options.fetchProjects ?? (() => fetchPinnedProjects(options.intro)))()
  const page = profilePage(options.intro, projects)

  const homeChanged = await writeIfChanged(homeMdx, renderHomeMdx(options.intro, projects))
  const dataChanged = await writeIfChanged(profileData, renderProfileDataModule(page.projects))

  if (options.format && (homeChanged || dataChanged)) {
    await formatGenerated(options.siteRoot, [homeMdx, profileData], options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareProfileOnce(options: PrepareProfileOptions): Promise<void> {
  prepareOnce ??= prepareProfile({ ...options, format: options.format ?? false })
  return prepareOnce
}
