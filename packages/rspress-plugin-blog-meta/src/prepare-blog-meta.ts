import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import type { SpawnFn } from '@heyq02/rspress-plugin-utils'

import {
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from './blog-posts.ts'

export interface PrepareBlogMetaOptions {
  siteRoot: string
  format?: boolean
  spawnFn?: SpawnFn
}

/** Absolute path of the blog directory. */
export function blogDirOf(siteRoot: string): string {
  return resolve(siteRoot, 'blogs', 'blog')
}

/** Write `_meta.json` for `blog/`, `posts/`, and `interview/`. */
export async function prepareBlogMeta(options: PrepareBlogMetaOptions): Promise<void> {
  const blogDir = blogDirOf(options.siteRoot)
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

  if (options.format && results.some(Boolean)) {
    await formatGenerated(options.siteRoot, Object.values(files), options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareBlogMetaOnce(options: PrepareBlogMetaOptions): Promise<void> {
  prepareOnce ??= prepareBlogMeta({ ...options, format: options.format ?? false })
  return prepareOnce
}
