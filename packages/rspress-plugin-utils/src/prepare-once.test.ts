import { describe, expect, it, vi } from 'vitest'

import { createPrepareOnce } from './prepare-once.ts'

describe('createPrepareOnce', () => {
  it('runs prepare only once for repeated callers', async () => {
    const prepare = vi.fn<(options: { n: number }) => Promise<void>>(() => Promise.resolve())
    const once = createPrepareOnce(prepare)

    await Promise.all([once({ n: 1 }), once({ n: 2 }), once({ n: 3 })])

    expect(prepare).toHaveBeenCalledTimes(1)
    expect(prepare).toHaveBeenCalledWith({ n: 1 })
  })
})
