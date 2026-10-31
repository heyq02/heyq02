import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { absolutizeMarkdownLinks } from '../scripts/absolutize-md-links.ts'

it('rewrites root-relative markdown links across path shapes', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'heyq02-md-'))
  await mkdir(join(dist, 'blog/posts'), { recursive: true })
  await mkdir(join(dist, 'friends'), { recursive: true })
  await writeFile(join(dist, 'blog/posts/post.md'), '# Post\n')
  await writeFile(join(dist, 'friends/index.md'), '# Friends\n')
  await writeFile(join(dist, 'notes.txt'), 'notes\n')
  await writeFile(join(dist, 'feed.xml'), '<feed />\n')
  await writeFile(join(dist, 'llms-full.txt'), 'full\n')
  await writeFile(
    join(dist, 'blog/index.md'),
    [
      '### [Post](/blog/posts/post/)',
      '[Direct](/blog/posts/post.md)',
      '[Txt](/notes.txt)',
      '[Xml](/feed.xml)',
      '[Friends](/friends)',
      '[Missing](/nope/)',
      '[Asset](/assets/logo.png)',
      '[Proto](//cdn.example/x)',
      ''
    ].join('\n')
  )
  await writeFile(join(dist, 'index.md'), '[Post](/blog/posts/post/#section)\n')
  await writeFile(join(dist, 'unchanged.md'), 'No root-relative links here.\n')

  await absolutizeMarkdownLinks(dist, 'https://heyq02.com/')

  expect(await readFile(join(dist, 'blog/index.md'), 'utf8')).toBe(
    [
      '### [Post](https://heyq02.com/blog/posts/post.md)',
      '[Direct](https://heyq02.com/blog/posts/post.md)',
      '[Txt](https://heyq02.com/notes.txt)',
      '[Xml](https://heyq02.com/feed.xml)',
      '[Friends](https://heyq02.com/friends/index.md)',
      '[Missing](https://heyq02.com/nope/)',
      '[Asset](https://heyq02.com/assets/logo.png)',
      '[Proto](//cdn.example/x)',
      ''
    ].join('\n')
  )
  expect(await readFile(join(dist, 'index.md'), 'utf8')).toBe(
    '[Post](https://heyq02.com/blog/posts/post.md#section)\n'
  )
  expect(await readFile(join(dist, 'unchanged.md'), 'utf8')).toBe('No root-relative links here.\n')
  expect(await readFile(join(dist, 'llms-full.txt'), 'utf8')).toBe('full\n')
})
