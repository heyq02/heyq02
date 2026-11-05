import { createPrepareOnce, formatGenerated, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { SpawnFn } from '@heyq02/rspress-plugin-utils'
import type { Intro } from '@heyq02/rspress-site-content'

import { githubLoginFromPlaces } from './github-client.ts'
import { fetchContributionCalendar } from './github-contributions.ts'
import type { ContributionCalendar } from './github-contributions.ts'
import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
import { profilePage, renderProfileDataModule } from './profile-page.ts'

export interface PrepareProfileOptions {
  /** Absolute path of generated `theme/profile-data.ts`. */
  profileDataPath: string
  intro: Intro
  /** Workspace cwd used when formatting generated files. */
  formatRoot?: string
  format?: boolean
  fetchProjects?: (login: string) => Promise<PinnedProject[]>
  fetchContributions?: (login: string) => Promise<ContributionCalendar>
  spawnFn?: SpawnFn
}

/** Fetch GitHub pins/contributions and write `profile-data.ts` for `@theme/ProfilePage`. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const { profileDataPath, intro } = options
  const login = githubLoginFromPlaces(intro.places)
  const [projects, contributions] = await Promise.all([
    (options.fetchProjects ?? fetchPinnedProjects)(login),
    (options.fetchContributions ?? fetchContributionCalendar)(login)
  ])
  const page = profilePage(intro, projects, contributions)
  const dataChanged = await writeIfChanged(profileDataPath, renderProfileDataModule(page))

  if (options.format && options.formatRoot && dataChanged) {
    await formatGenerated(options.formatRoot, [profileDataPath], options.spawnFn)
  }
}

export const prepareProfileOnce = createPrepareOnce((options: PrepareProfileOptions) =>
  prepareProfile({ ...options, format: options.format ?? false })
)
