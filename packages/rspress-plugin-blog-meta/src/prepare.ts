import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/shared/fs'
import type { SpawnFn } from '@heyq02/shared/fs'

import { listBlogPosts, renderBlogMetaJson, renderPostsMetaJson } from './blog-posts.ts'

export interface PrepareBlogMetaOptions {
  siteRoot: string
  format?: boolean
  /** Test seam for `vp fmt`. */
  spawnFn?: SpawnFn
}

/** Write `blog/_meta.json` and `blog/posts/_meta.json` from post files. */
export async function prepareBlogMeta(options: PrepareBlogMetaOptions): Promise<void> {
  const site = options.siteRoot
  const blogDir = resolve(site, 'blogs/blog')
  const postsDir = resolve(blogDir, 'posts')
  const blogMeta = resolve(blogDir, '_meta.json')
  const postsMeta = resolve(postsDir, '_meta.json')
  await mkdir(postsDir, { recursive: true })
  const posts = await listBlogPosts(postsDir)
  const changed = [
    await writeIfChanged(blogMeta, renderBlogMetaJson()),
    await writeIfChanged(postsMeta, renderPostsMetaJson(posts))
  ].some(Boolean)
  if (options.format && changed) {
    await formatGenerated(site, [blogMeta, postsMeta], options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareBlogMetaOnce(options: PrepareBlogMetaOptions): Promise<void> {
  prepareOnce ??= prepareBlogMeta({ ...options, format: options.format ?? false })
  return prepareOnce
}
