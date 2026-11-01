import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { dateFromSlug, listBlogPosts, listInterviewNotes } from '../src/blog-posts.ts'

it('returns empty list when posts dir is missing', async () => {
  const missing = join(tmpdir(), `heyq02-missing-posts-${Date.now()}`)
  await expect(listBlogPosts(missing)).resolves.toEqual([])
})

it('parses posts without frontmatter and strips emoji titles', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-posts-edge-'))
  try {
    await mkdir(root, { recursive: true })
    await writeFile(join(root, 'index.mdx'), '# skip index\n')
    await writeFile(join(root, 'plain.md'), '# 🎉 Hello world\n\nBody\n')
    await writeFile(join(root, 'dated.mdx'), '---\ndate: 2026-01-01\n---\n\n# Older\n')
    await writeFile(
      join(root, 'newer.mdx'),
      '---\ntitle: "Quoted"\ndescription: \'Note\'\ndate: 2026-02-01\nbroken\n---\n\n# Ignored heading\n'
    )
    const posts = await listBlogPosts(root)
    expect(posts.map(p => p.slug)).toEqual(['newer', 'dated', 'plain'])
    expect(posts[0]?.title).toBe('Quoted')
    expect(posts[0]?.description).toBe('Note')
    expect(posts[2]?.title).toBe('Hello world')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('rethrows unexpected readdir errors', async () => {
  await expect(listBlogPosts('/dev/null/not-a-dir')).rejects.toThrow(/ENOTDIR|ENOTSUP|EINVAL/)
})

it('treats unclosed frontmatter as body', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-posts-fm-'))
  try {
    await writeFile(join(root, 'open.md'), '---\ntitle: Open\n# Still body\n')
    await writeFile(join(root, 'empty.md'), 'no heading here\n')
    const posts = await listBlogPosts(root)
    expect(posts.find(p => p.slug === 'open')?.title).toBe('Still body')
    expect(posts.find(p => p.slug === 'empty')?.title).toBe('empty')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('falls back to YYYY-MM-DD in the slug when frontmatter date is missing', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-interview-date-'))
  try {
    await writeFile(join(root, 'daily-frontend-interview-2024-03-09.md'), '# Notes\n')
    const notes = await listInterviewNotes(root)
    expect(notes[0]?.date).toBe('2024-03-09')
    expect(notes[0]?.href).toBe('/blog/interview/daily-frontend-interview-2024-03-09/')
    expect(dateFromSlug('no-date-here')).toBe('')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
