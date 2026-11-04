import type { RspressPlugin } from '@rspress/core'

import { prepareProfileOnce } from './prepare-profile.ts'
import type { PrepareProfileOptions } from './prepare-profile.ts'

export type { Intro } from '@heyq02/rspress-site-content'

export {
  fetchPinnedProjects,
  githubLogin,
  githubToken,
  mapPinnedRepository,
  PINNED_TIMEOUT_MS
} from './github-pinned.ts'
export type { GraphqlClient, PinnedProject } from './github-pinned.ts'
export { prepareProfile, prepareProfileOnce } from './prepare-profile.ts'
export type { PrepareProfileOptions } from './prepare-profile.ts'
export {
  documentTitleSuffix,
  profilePage,
  renderHomeMdx,
  renderProfileDataModule
} from './profile-page.ts'
export type { ProfilePageView, ProfileProjectView } from './profile-page.ts'
export { skillIconsPicture } from './skills-picture.ts'
export type { SkillIcon } from './skills-picture.ts'

export type PluginProfileOptions = PrepareProfileOptions

/** Fetch pinned repos and regenerate homepage data before Rspress scans routes. */
export function pluginProfile(options: PluginProfileOptions): RspressPlugin {
  if (!options.homeMdxPath || !options.profileDataPath) {
    throw new Error(
      '@heyq02/rspress-plugin-profile: `homeMdxPath` and `profileDataPath` are required'
    )
  }

  return {
    name: '@heyq02/rspress-plugin-profile',
    async config(config) {
      await prepareProfileOnce({ ...options, format: false })
      return config
    }
  }
}
