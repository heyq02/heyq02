import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { writeIfChanged } from './write-if-changed.ts'

describe('writeIfChanged', () => {
  it('writes missing files and skips identical content', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'heyq02-write-'))
    const path = join(dir, 'out.json')

    await expect(writeIfChanged(path, '{"ok":true}\n')).resolves.toBe(true)
    await expect(readFile(path, 'utf8')).resolves.toBe('{"ok":true}\n')
    await expect(writeIfChanged(path, '{"ok":true}\n')).resolves.toBe(false)
  })

  it('rewrites when content changes', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'heyq02-write-'))
    const path = join(dir, 'out.json')
    await writeFile(path, 'old\n', 'utf8')

    await expect(writeIfChanged(path, 'new\n')).resolves.toBe(true)
    await expect(readFile(path, 'utf8')).resolves.toBe('new\n')
  })
})
