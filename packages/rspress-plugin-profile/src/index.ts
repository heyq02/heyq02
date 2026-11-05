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
} from '@heyq02/rspress-site-content'
export { fetchPinnedProjects, mapPinnedRepository, STUB_PINNED_PROJECTS } from './github-pinned.ts'
export type { GraphQlRepository, PinnedProject } from './github-pinned.ts'
export { prepareProfile, prepareProfileOnce } from './prepare-profile.ts'
export type { PrepareProfileOptions } from './prepare-profile.ts'
export { profileData, renderProfileDataJson } from './profile-page.ts'

export type PluginProfileOptions = PrepareProfileOptions

/** Optional: refresh `content/data/github-profile.json` during Rspress config (prefer CI script). */
export function pluginProfile(options: PluginProfileOptions): RspressPlugin {
  if (!options.dataPath) {
    throw new Error('@heyq02/rspress-plugin-profile: `dataPath` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-profile',
    async config(config) {
      await prepareProfileOnce(options)
      return config
    }
  }
}
