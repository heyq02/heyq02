import { spawn } from 'node:child_process'
import { cp, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { listBlogPosts, renderBlogMetaJson, renderPostsMetaJson } from '../src/blog-posts.ts'
import { fetchPinnedProjects } from '../src/github-pinned.ts'
import { renderHomeMdx } from '../src/profile-page.ts'

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

/** Copy public assets and write the theme-component homepage. */
export async function prepareSite() {
  const site = resolve(import.meta.dirname, '..')
  const publicDir = resolve(site, 'blogs/public')
  const blogDir = resolve(site, 'blogs/blog')
  const postsDir = resolve(blogDir, 'posts')
  const homeMdx = resolve(site, 'blogs/index.mdx')
  const blogMeta = resolve(blogDir, '_meta.json')
  const postsMeta = resolve(postsDir, '_meta.json')
  const posts = await listBlogPosts(postsDir)
  const projects = await fetchPinnedProjects()
  await mkdir(publicDir, { recursive: true })
  await mkdir(postsDir, { recursive: true })
  await cp(resolve(site, '../../static/signature/full-nobg.ico'), resolve(publicDir, 'favicon.ico'))
  await cp(resolve(site, '../../static/signature/full-nobg.png'), resolve(publicDir, 'favicon.png'))
  await cp(
    resolve(site, '../../static/signature/full-nobg.png'),
    resolve(publicDir, 'signature.png')
  )
  await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
  await writeFile(homeMdx, renderHomeMdx(posts, projects))
  await writeFile(blogMeta, renderBlogMetaJson())
  await writeFile(postsMeta, renderPostsMetaJson(posts))
  await formatGenerated(site, [homeMdx, blogMeta, postsMeta])
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await prepareSite()
}
