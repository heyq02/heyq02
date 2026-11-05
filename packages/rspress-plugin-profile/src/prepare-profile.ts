import { createPrepareOnce, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { ContributionCalendar, Intro } from '@heyq02/rspress-site-content'

import { githubLoginFromPlaces } from './github-client.ts'
import { fetchContributionCalendar } from './github-contributions.ts'
import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
import { profileData, renderProfileDataJson } from './profile-page.ts'

export interface PrepareProfileOptions {
  /** Absolute path of committed snapshot, e.g. `content/data/github-profile.json`. */
  dataPath: string
  intro: Intro
  fetchProjects?: (login: string) => Promise<PinnedProject[]>
  fetchContributions?: (login: string) => Promise<ContributionCalendar>
}

/** Fetch GitHub pins/contributions and write `content/data/github-profile.json`. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const { dataPath, intro } = options
  const login = githubLoginFromPlaces(intro.places)
  const [projects, contributions] = await Promise.all([
    (options.fetchProjects ?? fetchPinnedProjects)(login),
    (options.fetchContributions ?? fetchContributionCalendar)(login)
  ])
  await writeIfChanged(dataPath, renderProfileDataJson(profileData(projects, contributions)))
}

export const prepareProfileOnce = createPrepareOnce((options: PrepareProfileOptions) =>
  prepareProfile(options)
)
