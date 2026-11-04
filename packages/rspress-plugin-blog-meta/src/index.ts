import type { RspressPlugin } from '@rspress/core'

import { prepareBlogMetaOnce } from './prepare-blog-meta.ts'

export {
  BLOG_LABELS,
  dateFromSlug,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from './blog-posts.ts'
export type { BlogPost } from './blog-posts.ts'
export { blogDirOf, prepareBlogMeta, prepareBlogMetaOnce } from './prepare-blog-meta.ts'
export type { PrepareBlogMetaOptions } from './prepare-blog-meta.ts'

export interface PluginBlogMetaOptions {
  /** Absolute path of the site app root (contains `blogs/blog`). */
  siteRoot: string
}

/** Regenerate blog `_meta.json` sidebars before Rspress scans routes. */
export function pluginBlogMeta(options: PluginBlogMetaOptions): RspressPlugin {
  if (!options.siteRoot) {
    throw new Error('@heyq02/rspress-plugin-blog-meta: `siteRoot` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-blog-meta',
    async config(config) {
      await prepareBlogMetaOnce({ siteRoot: options.siteRoot, format: false })
      return config
    }
  }
}
