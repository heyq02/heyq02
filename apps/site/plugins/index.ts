import type { RspressPlugin } from '@rspress/core'

import { prepareBlogMetaOnce } from './prepare-blog-meta.ts'
import { prepareProfileOnce } from './prepare-profile.ts'
import { prepareSiteAssetsOnce } from './prepare-site-assets.ts'

export type { BlogPost } from './blog-posts.ts'
export {
  BLOG_LABELS,
  dateFromSlug,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from './blog-posts.ts'
export type { PinnedProject } from './github-pinned.ts'
export {
  PINNED_TIMEOUT_MS,
  fetchPinnedProjects,
  githubLogin,
  githubToken,
  mapPinnedRepository
} from './github-pinned.ts'
export type { PrepareBlogMetaOptions } from './prepare-blog-meta.ts'
export { prepareBlogMeta, prepareBlogMetaOnce } from './prepare-blog-meta.ts'
export type { PrepareProfileOptions } from './prepare-profile.ts'
export { prepareProfile, prepareProfileOnce } from './prepare-profile.ts'
export type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'
export { prepareSiteAssets, prepareSiteAssetsOnce } from './prepare-site-assets.ts'
export type { RenderHomeMdxOptions } from './profile-page.ts'
export { documentTitleSuffix, profilePage, renderHomeMdx } from './profile-page.ts'

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
