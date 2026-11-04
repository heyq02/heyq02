import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { writeIfChanged } from '../write-if-changed.ts'

it('writes new files and skips identical content', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'heyq02-write-'))
  const path = join(dir, 'out.txt')

  expect(await writeIfChanged(path, 'one\n')).toBe(true)
  expect(await readFile(path, 'utf8')).toBe('one\n')
  expect(await writeIfChanged(path, 'one\n')).toBe(false)
  await writeFile(path, 'stale\n')
  expect(await writeIfChanged(path, 'two\n')).toBe(true)
  expect(await readFile(path, 'utf8')).toBe('two\n')
})
