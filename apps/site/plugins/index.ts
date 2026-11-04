import type { RspressPlugin } from '@rspress/core'

import { prepareBlogMetaOnce } from './prepare-blog-meta.ts'
import { prepareProfileOnce } from './prepare-profile.ts'
import { prepareSiteAssetsOnce } from './prepare-site-assets.ts'

/** Regenerate `blogs/public` assets before Rspress scans routes. */
export function pluginSiteAssets(siteRoot: string): RspressPlugin {
  return {
    name: 'rspress-plugin-site-assets',
    async config(config) {
      await prepareSiteAssetsOnce({ siteRoot })
      return config
    }
  }
}

/** Regenerate blog `_meta.json` sidebars before Rspress scans routes. */
export function pluginBlogMeta(siteRoot: string): RspressPlugin {
  return {
    name: 'rspress-plugin-blog-meta',
    async config(config) {
      await prepareBlogMetaOnce({ siteRoot, format: false })
      return config
    }
  }
}

/** Regenerate the homepage `index.mdx` before Rspress scans routes. */
export function pluginProfile(siteRoot: string): RspressPlugin {
  return {
    name: 'rspress-plugin-profile',
    async config(config) {
      await prepareProfileOnce({ siteRoot, format: false })
      return config
    }
  }
}
