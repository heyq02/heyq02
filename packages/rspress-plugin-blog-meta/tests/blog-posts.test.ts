import { resolve } from 'node:path'

import { expect, it } from 'vite-plus/test'

import {
  dateFromSlug,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from '../src/blog-posts.ts'

const sitePostsDir = resolve(import.meta.dirname, '../../../apps/site/blogs/blog/posts')
const siteInterviewDir = resolve(import.meta.dirname, '../../../apps/site/blogs/blog/interview')

it('lists markdown posts under apps/site blogs/blog/posts', async () => {
  const posts = await listBlogPosts(sitePostsDir)
  expect(posts.length).toBeGreaterThan(0)
  expect(posts.map(post => post.slug)).toEqual([
    'macos-disable-ime-switching',
    'webpack-import-path-variables',
    'multi-mcp-aggregation-nginx-vs-express',
    'weixin-homepage-ui-recreation',
    'npm-download-daily-report',
    'anaconda-vscode-encoding-bug',
    'vue-router-hash-external-listen',
    'iframe-child-route-state',
    'python-tkinter-radix-converter'
  ])
  expect(posts[0]?.href).toBe('/blog/posts/macos-disable-ime-switching/')
  expect(posts[0]?.date).toBe('2026-10-31')
  expect(posts.find(post => post.slug === 'npm-download-daily-report')?.date).toBe('2024-03-19')
  expect(posts.at(-1)?.slug).toBe('python-tkinter-radix-converter')
})

it('lists interview notes newest-first without mixing into Writing posts', async () => {
  const notes = await listInterviewNotes(siteInterviewDir)
  expect(notes.length).toBe(28)
  expect(notes[0]?.slug).toBe('daily-frontend-interview-2024-03-18-pause')
  expect(notes[0]?.href).toBe('/blog/interview/daily-frontend-interview-2024-03-18-pause/')
  expect(notes[0]?.date).toBe('2024-03-18')
  expect(notes.at(-1)?.slug).toBe('daily-frontend-interview-2023-02-22')
  expect(dateFromSlug('daily-frontend-interview-2024-03-01')).toBe('2024-03-01')
  expect(dateFromSlug('jd-frontend-interview-1')).toBe('')
})

it('renders blog sidebar meta with Overview, Posts, and Interview', () => {
  expect(JSON.parse(renderBlogMetaJson())).toEqual([
    { type: 'file', name: 'index', label: 'Overview' },
    { type: 'dir', name: 'posts', label: 'Posts' },
    { type: 'dir', name: 'interview', label: 'Interview' }
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
