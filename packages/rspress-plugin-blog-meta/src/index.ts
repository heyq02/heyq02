import type { RspressPlugin } from '@rspress/core'

import { prepareBlogMetaOnce } from './prepare.ts'
import type { PrepareBlogMetaOptions } from './prepare.ts'

export type { BlogPost } from './blog-posts.ts'
export {
  BLOG_LABELS,
  dateFromSlug,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from './blog-posts.ts'
export type { PrepareBlogMetaOptions } from './prepare.ts'
export { blogDirOf, prepareBlogMeta, prepareBlogMetaOnce } from './prepare.ts'

export function pluginBlogMeta(options: PrepareBlogMetaOptions): RspressPlugin {
  return {
    name: 'rspress-plugin-blog-meta',
    async config(config) {
      await prepareBlogMetaOnce(options)
      return config
    }
  }
}
