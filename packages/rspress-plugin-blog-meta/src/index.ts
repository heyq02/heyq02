import type { RspressPlugin } from '@rspress/core'

import { prepareBlogMetaOnce } from './prepare-blog-meta.ts'
import type { PrepareBlogMetaOptions } from './prepare-blog-meta.ts'

export {
  BLOG_LABELS,
  dateFromSlug,
  formatZhDate,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson,
  renderRecentPostsModule
} from './blog-posts.ts'
export type { BlogPost } from './blog-posts.ts'
export { prepareBlogMeta, prepareBlogMetaOnce } from './prepare-blog-meta.ts'
export type { PrepareBlogMetaOptions } from './prepare-blog-meta.ts'

export type PluginBlogMetaOptions = PrepareBlogMetaOptions

/** Regenerate blog `_meta.json` sidebars before Rspress scans routes. */
export function pluginBlogMeta(options: PluginBlogMetaOptions): RspressPlugin {
  if (!options.blogDir) {
    throw new Error('@heyq02/rspress-plugin-blog-meta: `blogDir` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-blog-meta',
    async config(config) {
      await prepareBlogMetaOnce({ ...options, format: false })
      return config
    }
  }
}
