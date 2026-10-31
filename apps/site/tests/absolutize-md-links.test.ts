import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { absolutizeMarkdownLinks } from '../scripts/absolutize-md-links.ts'

it('rewrites root-relative markdown links to absolute .md URLs', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'heyq02-md-'))
  await mkdir(join(dist, 'blog/posts'), { recursive: true })
  await writeFile(join(dist, 'blog/posts/post.md'), '# Post\n')
  await writeFile(join(dist, 'blog/index.md'), '### [Post](/blog/posts/post/)\n')
  await writeFile(join(dist, 'index.md'), '[Post](/blog/posts/post/#section)\n')

  await absolutizeMarkdownLinks(dist, 'https://heyq02.com/')

  expect(await readFile(join(dist, 'blog/index.md'), 'utf8')).toBe(
    '### [Post](https://heyq02.com/blog/posts/post.md)\n'
  )
  expect(await readFile(join(dist, 'index.md'), 'utf8')).toBe(
    '[Post](https://heyq02.com/blog/posts/post.md#section)\n'
  )
})
