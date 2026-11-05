import { createPrepareOnce } from '@heyq02/rspress-plugin-utils'
import type { RspressPlugin } from '@rspress/core'

import { prepareSiteAssets } from './prepare-site-assets.ts'
import type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export { prepareSiteAssets } from './prepare-site-assets.ts'
export type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export type PluginSiteAssetsOptions = PrepareSiteAssetsOptions

const prepareSiteAssetsOnce = createPrepareOnce(prepareSiteAssets)

/** Copy brand / public assets into `blogs/public` before Rspress scans routes. */
export function pluginSiteAssets(options: PluginSiteAssetsOptions): RspressPlugin {
  if (
    !options.outDir ||
    !options.faviconPath ||
    !options.signaturePath ||
    !options.wechatPath ||
    !options.watermarkPath
  ) {
    throw new Error(
      '@heyq02/rspress-plugin-site-assets: `outDir`, `faviconPath`, `signaturePath`, `wechatPath`, and `watermarkPath` are required'
    )
  }

  return {
    name: '@heyq02/rspress-plugin-site-assets',
    async config(config) {
      await prepareSiteAssetsOnce(options)
      return config
    }
  }
}
