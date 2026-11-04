import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { SpawnFn } from '@heyq02/rspress-plugin-utils'

import {
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson,
  renderRecentPostsModule
} from './blog-posts.ts'

export interface PrepareBlogMetaOptions {
  /** Absolute path of the blog directory (`…/blogs/blog`). */
  blogDir: string
  /** Absolute path of generated `theme/recent-posts.ts` for the homepage. */
  recentPostsPath?: string
  /** How many newest posts to expose on the homepage. */
  recentLimit?: number
  /** Workspace cwd used when formatting generated `_meta.json` files. */
  formatRoot?: string
  format?: boolean
  spawnFn?: SpawnFn
}

/** Write `_meta.json` for `blog/`, `posts/`, and `interview/`. */
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
    await writeIfChanged(files.blog, renderBlogMetaJson()),
    await writeIfChanged(files.posts, renderPostsMetaJson(posts)),
    await writeIfChanged(files.interview, renderPostsMetaJson(interviews))
  ]

  const generatedPaths = Object.values(files)
  if (options.recentPostsPath) {
    const recentChanged = await writeIfChanged(
      options.recentPostsPath,
      renderRecentPostsModule(posts, options.recentLimit ?? 6)
    )
    results.push(recentChanged)
    generatedPaths.push(options.recentPostsPath)
  }

  if (options.format && options.formatRoot && results.some(Boolean)) {
    await formatGenerated(options.formatRoot, generatedPaths, options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareBlogMetaOnce(options: PrepareBlogMetaOptions): Promise<void> {
  prepareOnce ??= prepareBlogMeta({ ...options, format: options.format ?? false })
  return prepareOnce
}
