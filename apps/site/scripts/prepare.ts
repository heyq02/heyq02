import { cp, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { listBlogPosts, renderBlogMetaJson, renderPostsMetaJson } from '../src/blog-posts.ts'
import { fetchPinnedProjects } from '../src/github-pinned.ts'
import { renderHomeMdx } from '../src/profile-page.ts'

/** Copy public assets and write the theme-component homepage. */
export async function prepareSite() {
  const site = resolve(import.meta.dirname, '..')
  const publicDir = resolve(site, 'blogs/public')
  const blogDir = resolve(site, 'blogs/blog')
  const postsDir = resolve(blogDir, 'posts')
  const posts = await listBlogPosts(postsDir)
  const projects = await fetchPinnedProjects()
  await mkdir(publicDir, { recursive: true })
  await mkdir(postsDir, { recursive: true })
  await cp(resolve(site, '../../static/signature/full-nobg.ico'), resolve(publicDir, 'favicon.ico'))
  await cp(resolve(site, '../../static/signature/full-nobg.png'), resolve(publicDir, 'favicon.png'))
  await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
  await writeFile(resolve(site, 'blogs/index.mdx'), renderHomeMdx(posts, projects))
  await writeFile(resolve(blogDir, '_meta.json'), renderBlogMetaJson())
  await writeFile(resolve(postsDir, '_meta.json'), renderPostsMetaJson(posts))
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await prepareSite()
}
