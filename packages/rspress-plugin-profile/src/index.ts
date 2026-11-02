import type { RspressPlugin } from '@rspress/core'

import { prepareProfileOnce } from './prepare.ts'
import type { PrepareProfileOptions } from './prepare.ts'

export type { ProfileLang, RenderHomeMdxOptions } from './profile-page.ts'
export { documentTitleSuffix, profilePage, renderHomeMdx, sectionsFor } from './profile-page.ts'
export type { PrepareProfileOptions } from './prepare.ts'
export { PROFILE_LANGS, prepareProfile, prepareProfileOnce } from './prepare.ts'

export function pluginProfile(options: PrepareProfileOptions): RspressPlugin {
  return {
    name: 'rspress-plugin-profile',
    async config(config) {
      await prepareProfileOnce(options)
      return config
    }
  }
}
