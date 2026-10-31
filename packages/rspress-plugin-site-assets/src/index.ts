import type { RspressPlugin } from '@rspress/core'

import { prepareSiteAssetsOnce } from './prepare.ts'
import type { PrepareSiteAssetsOptions } from './prepare.ts'

export type { PrepareSiteAssetsOptions } from './prepare.ts'
export { prepareSiteAssets, prepareSiteAssetsOnce } from './prepare.ts'

export function pluginSiteAssets(options: PrepareSiteAssetsOptions): RspressPlugin {
  return {
    name: 'rspress-plugin-site-assets',
    async config(config) {
      await prepareSiteAssetsOnce(options)
      return config
    }
  }
}
