import { describe, expect, it } from 'vite-plus/test'

import { formatCount } from './github-profile.ts'

describe('formatCount', () => {
  it('keeps small counts plain', () => {
    expect(formatCount(0)).toBe('0')
    expect(formatCount(999)).toBe('999')
  })

  it('formats thousands with a trimmed k suffix', () => {
    expect(formatCount(1000)).toBe('1k')
    expect(formatCount(1500)).toBe('1.5k')
    expect(formatCount(10_000)).toBe('10k')
  })
})
