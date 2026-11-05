import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vite-plus/test'

import { absolutizeMarkdownLinks, toAbsoluteMarkdownUrl } from './absolutize-md-links.ts'

describe('toAbsoluteMarkdownUrl', () => {
  const existing = new Set(['/blog/posts/a.md', '/friends.md', '/llms-full.txt'])

  it('prefers the SSG-MD sibling for directory links', () => {
    expect(toAbsoluteMarkdownUrl(existing, 'https://heyq02.com', '/blog/posts/a/')).toBe(
      'https://heyq02.com/blog/posts/a.md'
    )
  })

  it('falls back to the original pathname when no sibling exists', () => {
    expect(toAbsoluteMarkdownUrl(existing, 'https://heyq02.com', '/missing/')).toBe(
      'https://heyq02.com/missing/'
    )
  })

  it('ignores protocol-relative paths', () => {
    expect(toAbsoluteMarkdownUrl(existing, 'https://heyq02.com', '//cdn.example/x')).toBeNull()
  })
})

describe('absolutizeMarkdownLinks', () => {
  it('rewrites root-relative markdown links in dist files', async () => {
    const dist = await mkdtemp(join(tmpdir(), 'heyq02-dist-'))
    await mkdir(join(dist, 'blog', 'posts'), { recursive: true })
    await writeFile(join(dist, 'blog', 'posts', 'a.md'), '# A\n', 'utf8')
    const index = join(dist, 'index.md')
    await writeFile(index, 'See [post](/blog/posts/a/) and [hash](/blog/posts/a/#x).\n', 'utf8')

    await absolutizeMarkdownLinks(dist, 'https://heyq02.com/')

    await expect(readFile(index, 'utf8')).resolves.toBe(
      'See [post](https://heyq02.com/blog/posts/a.md) and [hash](https://heyq02.com/blog/posts/a.md#x).\n'
    )
  })
})
