import type { RspressPlugin } from '@rspress/core'

import { prepareSiteAssetsOnce } from './prepare-site-assets.ts'

export { prepareSiteAssets, prepareSiteAssetsOnce } from './prepare-site-assets.ts'
export type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export interface PluginSiteAssetsOptions {
  /** Absolute path of the site app root (contains `blogs/` and `public/`). */
  siteRoot: string
}

/** Regenerate `blogs/public` assets before Rspress scans routes. */
export function pluginSiteAssets(options: PluginSiteAssetsOptions): RspressPlugin {
  if (!options.siteRoot) {
    throw new Error('@heyq02/rspress-plugin-site-assets: `siteRoot` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-site-assets',
    async config(config) {
      await prepareSiteAssetsOnce({ siteRoot: options.siteRoot })
      return config
    }
  }
}
