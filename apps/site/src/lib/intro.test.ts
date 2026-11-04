import { describe, expect, it } from 'vitest'

import { formatCount, intro } from './intro.ts'

describe('intro', () => {
  it('exposes site identity', () => {
    expect(intro.name).toBeTruthy()
    expect(intro.site).toMatch(/^https?:\/\//)
    expect(intro.places.some(place => place.label === 'GitHub')).toBe(true)
  })

  it('formats star counts', () => {
    expect(formatCount(42)).toBe('42')
    expect(formatCount(1200)).toBe('1.2k')
    expect(formatCount(1000)).toBe('1k')
  })
})
