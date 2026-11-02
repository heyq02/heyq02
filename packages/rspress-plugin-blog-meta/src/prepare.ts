import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { formatGenerated, writeIfChanged } from '@heyq02/shared/fs'
import type { SpawnFn } from '@heyq02/shared/fs'

import {
  langPrefix,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from './blog-posts.ts'
import type { BlogLang } from './blog-posts.ts'

export interface PrepareBlogMetaOptions {
  siteRoot: string
  format?: boolean
  /** Test seam for `vp fmt`. */
  spawnFn?: SpawnFn
}

/** Languages that get sidebar meta (each has its own `<lang>/blog` tree). */
export const BLOG_LANGS: readonly BlogLang[] = ['en', 'zh']

/** Absolute path of a language's blog directory. */
export function blogDirOf(siteRoot: string, lang: BlogLang): string {
  return resolve(siteRoot, 'blogs', lang, 'blog')
}

/** Write `_meta.json` for every language's `blog/`, `posts/`, and `interview/`. */
export async function prepareBlogMeta(options: PrepareBlogMetaOptions): Promise<void> {
  const site = options.siteRoot
  const changedFiles: string[] = []
  let changed = false

  for (const lang of BLOG_LANGS) {
    const blogDir = blogDirOf(site, lang)
    const postsDir = resolve(blogDir, 'posts')
    const interviewDir = resolve(blogDir, 'interview')
    await mkdir(postsDir, { recursive: true })
    await mkdir(interviewDir, { recursive: true })

    const prefix = langPrefix(lang)
    const posts = await listBlogPosts(postsDir, `${prefix}/blog/posts/`)
    const interviews = await listInterviewNotes(interviewDir, `${prefix}/blog/interview/`)

    const blogMeta = resolve(blogDir, '_meta.json')
    const postsMeta = resolve(postsDir, '_meta.json')
    const interviewMeta = resolve(interviewDir, '_meta.json')
    changedFiles.push(blogMeta, postsMeta, interviewMeta)

    const results = [
      await writeIfChanged(blogMeta, renderBlogMetaJson(lang)),
      await writeIfChanged(postsMeta, renderPostsMetaJson(posts)),
      await writeIfChanged(interviewMeta, renderPostsMetaJson(interviews))
    ]
    changed = results.some(Boolean) || changed
  }

  if (options.format && changed) {
    await formatGenerated(site, changedFiles, options.spawnFn)
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareBlogMetaOnce(options: PrepareBlogMetaOptions): Promise<void> {
  prepareOnce ??= prepareBlogMeta({ ...options, format: options.format ?? false })
  return prepareOnce
}
