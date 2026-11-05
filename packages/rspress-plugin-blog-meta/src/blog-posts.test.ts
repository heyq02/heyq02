import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vite-plus/test'

import {
  dateFromSlug,
  listBlogPosts,
  renderBlogMetaJson,
  renderPostsMetaJson,
  renderRecentPostsJson
} from './blog-posts.ts'
import type { BlogPost } from './blog-posts.ts'

const samplePosts: BlogPost[] = [
  {
    slug: 'newer',
    href: '/blog/posts/newer/',
    title: 'Newer',
    description: 'second',
    date: '2026-02-01'
  },
  {
    slug: 'older',
    href: '/blog/posts/older/',
    title: 'Older',
    description: 'first',
    date: '2026-01-01'
  }
]

describe('dateFromSlug', () => {
  it('pulls YYYY-MM-DD from the slug', () => {
    expect(dateFromSlug('2026-10-31-macos-ime')).toBe('2026-10-31')
  })

  it('returns empty when the slug has no date', () => {
    expect(dateFromSlug('macos-disable-ime-switching')).toBe('')
  })
})

describe('renderRecentPostsJson', () => {
  it('emits a JSON array capped by limit', () => {
    expect(JSON.parse(renderRecentPostsJson(samplePosts, 1))).toEqual([samplePosts[0]])
  })
})

describe('renderBlogMetaJson / renderPostsMetaJson', () => {
  it('builds sidebar entries from caller labels and posts', () => {
    expect(
      JSON.parse(renderBlogMetaJson({ overview: '概览', posts: '文章', interview: '面经' }))
    ).toEqual([
      { type: 'file', name: 'index', label: '概览' },
      { type: 'dir', name: 'posts', label: '文章' },
      { type: 'dir', name: 'interview', label: '面经' }
    ])

    expect(JSON.parse(renderPostsMetaJson(samplePosts))).toEqual([
      { type: 'file', name: 'newer', label: 'Newer', overviewHeaders: [2] },
      { type: 'file', name: 'older', label: 'Older', overviewHeaders: [2] }
    ])
  })
})

describe('listBlogPosts', () => {
  it('reads frontmatter and sorts newest first', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'heyq02-blog-'))
    await writeFile(
      join(dir, 'older.md'),
      `---\ntitle: Older\ndescription: first\ndate: 2026-01-01\n---\n\n# Older\n`,
      'utf8'
    )
    await writeFile(
      join(dir, 'newer.mdx'),
      `---\ntitle: Newer\ndescription: second\ndate: 2026-02-01\n---\n\n# Newer\n`,
      'utf8'
    )

    await expect(listBlogPosts(dir)).resolves.toEqual([
      {
        slug: 'newer',
        href: '/blog/posts/newer/',
        title: 'Newer',
        description: 'second',
        date: '2026-02-01'
      },
      {
        slug: 'older',
        href: '/blog/posts/older/',
        title: 'Older',
        description: 'first',
        date: '2026-01-01'
      }
    ])
  })
})
