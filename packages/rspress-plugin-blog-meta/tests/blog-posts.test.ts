import { resolve } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { listBlogPosts, renderBlogMetaJson, renderPostsMetaJson } from '../src/blog-posts.ts'

const sitePostsDir = resolve(import.meta.dirname, '../../../apps/site/blogs/blog/posts')

it('lists markdown posts under apps/site blogs/blog/posts', async () => {
  const posts = await listBlogPosts(sitePostsDir)
  expect(posts.length).toBeGreaterThan(0)
  expect(posts.map(post => post.slug)).toEqual([
    'anaconda-vscode-encoding-bug',
    'iframe-child-route-state',
    'python-tkinter-radix-converter',
    'webpack-import-path-variables',
    'multi-mcp-aggregation-nginx-vs-express',
    'vue-router-hash-external-listen',
    'npm-download-daily-report',
    'weixin-homepage-ui-recreation',
    'macos-disable-ime-switching'
  ])
  expect(posts[0]?.href).toBe('/blog/posts/anaconda-vscode-encoding-bug/')
  expect(posts[0]?.title).toContain('Anaconda')
  expect(posts[0]?.date).toBe('2026-11-01')
  expect(posts.at(-1)?.date).toBe('2026-10-31')
})

it('renders blog sidebar meta with Overview first', () => {
  expect(JSON.parse(renderBlogMetaJson())).toEqual([
    { type: 'file', name: 'index', label: 'Overview' },
    { type: 'dir', name: 'posts', label: 'Posts' }
  ])
})

it('renders posts sidebar meta from post slugs', () => {
  expect(
    JSON.parse(
      renderPostsMetaJson([
        {
          slug: 'demo',
          href: '/blog/posts/demo/',
          title: 'Demo',
          description: 'A note',
          date: '2026-10-31'
        }
      ])
    )
  ).toEqual([{ type: 'file', name: 'demo', label: 'Demo', overviewHeaders: [2] }])
})
