import { spawn } from 'node:child_process'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { listBlogPosts, renderBlogMetaJson, renderPostsMetaJson } from './blog-posts.ts'
import { fetchPinnedProjects } from './github-pinned.ts'
import type { PinnedProject } from './github-pinned.ts'
import { renderHomeMdx } from './profile-page.ts'

export interface PrepareSiteOptions {
  /** Site package root (`apps/site`). */
  siteRoot?: string
  /** Run `vp fmt` on generated files (CLI/manual only; skip in the Rspress plugin). */
  format?: boolean
  /** Override pinned fetch (tests). */
  fetchProjects?: () => Promise<PinnedProject[]>
}

async function writeIfChanged(path: string, content: string): Promise<boolean> {
  try {
    if ((await readFile(path, 'utf8')) === content) {
      return false
    }
  } catch {
    // Missing file → write.
  }
  await writeFile(path, content)
  return true
}

async function formatGenerated(site: string, files: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['exec', 'vp', 'fmt', ...files], {
      cwd: site,
      stdio: 'inherit'
    })
    child.on('exit', code => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`vp fmt exited ${code}`))
    })
  })
}

/**
 * Copy public assets and regenerate homepage MDX + blog `_meta.json` snapshots.
 * Called from the Rspress plugin `config` hook (before route scan) and the CLI.
 */
export async function prepareSite(options: PrepareSiteOptions = {}): Promise<void> {
  const site = options.siteRoot ?? resolve(import.meta.dirname, '..')
  const publicDir = resolve(site, 'blogs/public')
  const blogDir = resolve(site, 'blogs/blog')
  const postsDir = resolve(blogDir, 'posts')
  const homeMdx = resolve(site, 'blogs/index.mdx')
  const blogMeta = resolve(blogDir, '_meta.json')
  const postsMeta = resolve(postsDir, '_meta.json')
  const posts = await listBlogPosts(postsDir)
  const projects = await (options.fetchProjects ?? fetchPinnedProjects)()
  await mkdir(publicDir, { recursive: true })
  await mkdir(postsDir, { recursive: true })
  await cp(resolve(site, '../../static/signature/full-nobg.ico'), resolve(publicDir, 'favicon.ico'))
  await cp(resolve(site, '../../static/signature/full-nobg.png'), resolve(publicDir, 'favicon.png'))
  await cp(
    resolve(site, '../../static/signature/full-nobg.png'),
    resolve(publicDir, 'signature.png')
  )
  await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
  const changed = [
    await writeIfChanged(homeMdx, renderHomeMdx(posts, projects)),
    await writeIfChanged(blogMeta, renderBlogMetaJson()),
    await writeIfChanged(postsMeta, renderPostsMetaJson(posts))
  ].some(Boolean)
  if (options.format && changed) {
    await formatGenerated(site, [homeMdx, blogMeta, postsMeta])
  }
}

let prepareOnce: Promise<void> | undefined

/** Idempotent prepare for the Rspress plugin (one run per process). */
export function prepareSiteOnce(options: PrepareSiteOptions = {}): Promise<void> {
  prepareOnce ??= prepareSite({ ...options, format: options.format ?? false })
  return prepareOnce
}
