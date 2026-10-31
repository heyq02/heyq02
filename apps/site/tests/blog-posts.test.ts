import { expect, it } from 'vite-plus/test'

import { listBlogPosts, renderBlogMetaJson, renderPostsMetaJson } from '../src/blog-posts.ts'

it('lists markdown posts under blogs/blog/posts', async () => {
  const posts = await listBlogPosts()
  expect(posts.length).toBeGreaterThan(0)
  expect(posts[0]?.slug).toBe('macos-disable-ime-switching')
  expect(posts[0]?.href).toBe('/blog/posts/macos-disable-ime-switching/')
  expect(posts[0]?.title).toContain('macOS')
  expect(posts[0]?.date).toBe('2026-10-31')
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
