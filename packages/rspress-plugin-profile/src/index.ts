import type { RspressPlugin } from '@rspress/core'

import { prepareProfileOnce } from './prepare-profile.ts'
import type { PrepareProfileOptions } from './prepare-profile.ts'

export {
  GITHUB_TIMEOUT_MS,
  githubLoginFromPlaces,
  githubToken,
  profileStubEnabled,
  requireGithubToken
} from './github-client.ts'
export type { GraphqlClient } from './github-client.ts'
export {
  fetchContributionCalendar,
  mapContributionCalendar,
  stubContributionCalendar
} from './github-contributions.ts'
export type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel
} from './github-contributions.ts'
export { fetchPinnedProjects, mapPinnedRepository, STUB_PINNED_PROJECTS } from './github-pinned.ts'
export type { PinnedProject } from './github-pinned.ts'
export { prepareProfile, prepareProfileOnce } from './prepare-profile.ts'
export type { PrepareProfileOptions } from './prepare-profile.ts'
export { profilePage, renderProfileDataModule } from './profile-page.ts'
export type { ProfilePageView, ProfileProjectView } from './profile-page.ts'

export type PluginProfileOptions = PrepareProfileOptions

/** Fetch pinned repos / contributions and regenerate `profile-data.ts` before route scan. */
export function pluginProfile(options: PluginProfileOptions): RspressPlugin {
  if (!options.profileDataPath) {
    throw new Error('@heyq02/rspress-plugin-profile: `profileDataPath` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-profile',
    async config(config) {
      await prepareProfileOnce({ ...options, format: false })
      return config
    }
  }
}
