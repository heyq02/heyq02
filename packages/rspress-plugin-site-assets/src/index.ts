import type { RspressPlugin } from '@rspress/core'

import { prepareSiteAssetsOnce } from './prepare-site-assets.ts'
import type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export { prepareSiteAssets, prepareSiteAssetsOnce } from './prepare-site-assets.ts'
export type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export type PluginSiteAssetsOptions = PrepareSiteAssetsOptions

/** Regenerate public site assets before Rspress scans routes. */
export function pluginSiteAssets(options: PluginSiteAssetsOptions): RspressPlugin {
  if (!options.outDir || !options.signaturePath || !options.wechatPath || !options.watermarkPath) {
    throw new Error(
      '@heyq02/rspress-plugin-site-assets: `outDir`, `signaturePath`, `wechatPath`, and `watermarkPath` are required'
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
