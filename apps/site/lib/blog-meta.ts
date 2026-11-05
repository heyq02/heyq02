import { resolve } from 'node:path'

import type { PrepareBlogMetaOptions } from '@heyq02/rspress-plugin-blog-meta'

const siteRoot = resolve(import.meta.dirname, '..')
const repoRoot = resolve(siteRoot, '../..')

/** Shared blog-meta options for Rspress config + `cprepare-content`. */
export function siteBlogMetaOptions(
  overrides: Partial<PrepareBlogMetaOptions> = {}
): PrepareBlogMetaOptions {
  return {
    blogDir: resolve(siteRoot, 'blogs/blog'),
    labels: {
      overview: '概览',
      posts: '文章',
      interview: '面经'
    },
    recentPostsPath: resolve(repoRoot, 'content/data/recent-posts.json'),
    formatRoot: siteRoot,
    ...overrides
  }
}
