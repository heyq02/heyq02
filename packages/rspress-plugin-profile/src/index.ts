import type { RspressPlugin } from '@rspress/core'

import type { Intro } from './intro.ts'
import { prepareProfileOnce } from './prepare-profile.ts'

export {
  fetchPinnedProjects,
  githubLogin,
  githubToken,
  mapPinnedRepository,
  PINNED_TIMEOUT_MS
} from './github-pinned.ts'
export type { GraphqlClient, PinnedProject } from './github-pinned.ts'
export { formatCount } from './intro.ts'
export type { Contact, Education, Experience, Intro, Place, Skill } from './intro.ts'
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

export interface PluginProfileOptions {
  /** Absolute path of the site app root (contains `blogs/`). */
  siteRoot: string
  /** Profile identity SSOT (typically `static/data/intro.json`). */
  intro: Intro
}

/** Fetch pinned repos and regenerate homepage data before Rspress scans routes. */
export function pluginProfile(options: PluginProfileOptions): RspressPlugin {
  if (!options.siteRoot) {
    throw new Error('@heyq02/rspress-plugin-profile: `siteRoot` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-profile',
    async config(config) {
      await prepareProfileOnce({
        siteRoot: options.siteRoot,
        intro: options.intro,
        format: false
      })
      return config
    }
  }
}
