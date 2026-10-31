import { EventEmitter } from 'node:events'

import { expect, it } from 'vite-plus/test'

import { formatGenerated } from '../src/format-generated.ts'
import type { SpawnFn } from '../src/format-generated.ts'

function fakeSpawn(exitCode: number | null): SpawnFn {
  return ((_cmd, _args, _opts) => {
    const child = new EventEmitter() as ReturnType<SpawnFn>
    queueMicrotask(() => {
      child.emit('exit', exitCode)
    })
    return child
  }) as SpawnFn
}

it('resolves when vp fmt exits 0', async () => {
  await expect(formatGenerated('/tmp/site', ['a.mdx'], fakeSpawn(0))).resolves.toBeUndefined()
})

it('rejects when vp fmt exits non-zero', async () => {
  await expect(formatGenerated('/tmp/site', ['a.mdx'], fakeSpawn(1))).rejects.toThrow(
    /vp fmt exited 1/
  )
})
