import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { intro } from '@heyq02/shared'
import { expect, it } from 'vite-plus/test'

import { writeReadme } from '../src/index.ts'

it('readme e2e: writeReadme emits a markdown file with identity facts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'heyq02-e2e-readme-'))
  const out = join(dir, 'README.md')
  try {
    await writeReadme(out)
    const markdown = await readFile(out, 'utf8')
    expect(markdown).toContain(intro.name)
    expect(markdown).toContain('simpleicons.dev')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
