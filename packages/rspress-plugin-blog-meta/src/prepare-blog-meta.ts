import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createPrepareOnce, formatGenerated, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { SpawnFn } from '@heyq02/rspress-plugin-utils'

import {
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson,
  renderRecentPostsJson
} from './blog-posts.ts'
import type { BlogSidebarLabels } from './blog-posts.ts'

export interface PrepareBlogMetaOptions {
  /** Absolute path of the blog directory (`…/blogs/blog`). */
  blogDir: string
  /** Sidebar labels for overview / posts / interview (site IA). */
  labels: BlogSidebarLabels
  /**
   * Optional absolute path of generated `content/data/recent-posts.json`.
   * Explicit second output for the homepage — omit to skip.
   */
  recentPostsPath?: string
  /** How many newest posts to expose on the homepage. */
  recentLimit?: number
  /** Workspace cwd used when formatting generated `_meta.json` files. */
  formatRoot?: string
  format?: boolean
  spawnFn?: SpawnFn
}

/** Write `_meta.json` for `blog/`, `posts/`, and `interview/` (+ optional recent-posts). */
export async function prepareBlogMeta(options: PrepareBlogMetaOptions): Promise<void> {
  const blogDir = options.blogDir
  const postsDir = resolve(blogDir, 'posts')
  const interviewDir = resolve(blogDir, 'interview')
  await mkdir(postsDir, { recursive: true })
  await mkdir(interviewDir, { recursive: true })

  const posts = await listBlogPosts(postsDir)
  const interviews = await listInterviewNotes(interviewDir)

  const files = {
    blog: resolve(blogDir, '_meta.json'),
    posts: resolve(postsDir, '_meta.json'),
    interview: resolve(interviewDir, '_meta.json')
  }

  const results = [
    await writeIfChanged(files.blog, renderBlogMetaJson(options.labels)),
    await writeIfChanged(files.posts, renderPostsMetaJson(posts)),
    await writeIfChanged(files.interview, renderPostsMetaJson(interviews))
  ]

  const generatedPaths = Object.values(files)
  if (options.recentPostsPath) {
    const recentChanged = await writeIfChanged(
      options.recentPostsPath,
      renderRecentPostsJson(posts, options.recentLimit ?? 6)
    )
    results.push(recentChanged)
    generatedPaths.push(options.recentPostsPath)
  }

  if (options.format && options.formatRoot && results.some(Boolean)) {
    await formatGenerated(options.formatRoot, generatedPaths, options.spawnFn)
  }
}

export const prepareBlogMetaOnce = createPrepareOnce((options: PrepareBlogMetaOptions) =>
  prepareBlogMeta({ ...options, format: options.format ?? false })
)
