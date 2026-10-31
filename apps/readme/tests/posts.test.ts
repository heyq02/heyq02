import { expect, it } from 'vite-plus/test'

import intro from '../../../static/data/intro.json' with { type: 'json' }
import { listWritingPosts } from '../src/posts.ts'

it('lists blog posts with absolute site URLs', async () => {
  const posts = await listWritingPosts(intro.site)
  expect(posts.length).toBeGreaterThan(0)
  expect(posts[0]?.href).toMatch(/^https:\/\/heyq02\.com\/blog\/posts\/.+\/$/)
  expect(posts[0]?.title.length).toBeGreaterThan(0)
})

it('returns an empty list when the posts directory is missing', async () => {
  await expect(listWritingPosts(intro.site, '/tmp/heyq02-missing-posts')).resolves.toEqual([])
})
