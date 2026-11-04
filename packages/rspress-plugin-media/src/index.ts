import type { RspressPlugin } from '@rspress/core'

import { socialLinksFromMedia } from './media.ts'

export {
  loadMediaTable,
  parseMediaToml,
  socialLinksFromMedia,
  socialLinksFromMediaTable,
  svgForSimpleIcon
} from './media.ts'
export type { MediaEntry, MediaTable } from './media.ts'

export interface PluginMediaOptions {
  /** Absolute path to `personal/media.toml`. */
  mediaPath: string
}

/** Inject `themeConfig.socialLinks` from a media.toml via simple-icons SVGs. */
export function pluginMedia(options: PluginMediaOptions): RspressPlugin {
  if (!options.mediaPath) {
    throw new Error('@heyq02/rspress-plugin-media: `mediaPath` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-media',
    async config(config) {
      const socialLinks = await socialLinksFromMedia(options.mediaPath)
      return {
        ...config,
        themeConfig: {
          ...config.themeConfig,
          socialLinks
        }
      }
    }
  }
}
