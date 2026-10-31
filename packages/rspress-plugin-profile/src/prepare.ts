import { resolve } from 'node:path'

import { listBlogPosts } from 'rspress-plugin-blog-meta'
import { fetchPinnedProjects } from 'rspress-plugin-github-pins'
import type { PinnedProject } from 'rspress-plugin-github-pins'

import { formatGenerated } from './format-generated.ts'
import { renderHomeMdx } from './profile-page.ts'
import { writeIfChanged } from './write-if-changed.ts'

export interface PrepareProfileOptions {
  siteRoot: string
  format?: boolean
  fetchProjects?: () => Promise<PinnedProject[]>
  /** MDX import path for ProfilePlay (default `@theme/ProfilePlay`). */
  profilePlayModule?: string
}

/** Regenerate `blogs/index.mdx` from posts + pinned projects. */
export async function prepareProfile(options: PrepareProfileOptions): Promise<void> {
  const site = options.siteRoot
  const postsDir = resolve(site, 'blogs/blog/posts')
  const homeMdx = resolve(site, 'blogs/index.mdx')
  const posts = await listBlogPosts(postsDir)
  const projects = await (options.fetchProjects ?? fetchPinnedProjects)()
  const home = renderHomeMdx(posts, projects, {
    profilePlayModule: options.profilePlayModule ?? '@theme/ProfilePlay'
  })
  const changed = await writeIfChanged(homeMdx, home)
  if (options.format && changed) {
    await formatGenerated(site, [homeMdx])
  }
}

let prepareOnce: Promise<void> | undefined

export function prepareProfileOnce(options: PrepareProfileOptions): Promise<void> {
  prepareOnce ??= prepareProfile({ ...options, format: options.format ?? false })
  return prepareOnce
}
