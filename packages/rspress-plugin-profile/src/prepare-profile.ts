import { formatGenerated, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { SpawnFn } from '@heyq02/rspress-plugin-utils'
import type { Intro } from '@heyq02/rspress-site-content'

import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
import { profilePage, renderHomeMdx, renderProfileDataModule } from './profile-page.ts'

export interface PrepareProfileOptions {
  /** Absolute path of generated `blogs/index.mdx`. */
  homeMdxPath: string
  /** Absolute path of generated `theme/profile-data.ts`. */
  profileDataPath: string
  intro: Intro
  /** Workspace cwd used when formatting generated files. */
  formatRoot?: string
  format?: boolean
  fetchProjects?: () => Promise<PinnedProject[]>
  spawnFn?: SpawnFn
}

/** Regenerate homepage shell + pinned-project data for `@theme/ProfilePage`. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const { homeMdxPath, profileDataPath, intro } = options
  const projects = await (options.fetchProjects ?? (() => fetchPinnedProjects(intro)))()
  const page = profilePage(intro, projects)

  const homeChanged = await writeIfChanged(homeMdxPath, renderHomeMdx(intro, projects))
  const dataChanged = await writeIfChanged(profileDataPath, renderProfileDataModule(page.projects))

  if (options.format && options.formatRoot && (homeChanged || dataChanged)) {
    await formatGenerated(options.formatRoot, [homeMdxPath, profileDataPath], options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareProfileOnce(options: PrepareProfileOptions): Promise<void> {
  prepareOnce ??= prepareProfile({ ...options, format: options.format ?? false })
  return prepareOnce
}
