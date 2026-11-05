import { describe, expect, it } from 'vite-plus/test'

import { profileData, renderProfileDataJson } from './profile-page.ts'

describe('profileData / renderProfileDataJson', () => {
  it('assembles the committed snapshot shape', () => {
    const data = profileData(
      [
        {
          name: 'demo',
          href: 'https://github.com/heyq02/demo',
          summary: 'hi',
          language: 'TypeScript',
          stars: 1,
          forks: 0
        }
      ],
      { total: 3, href: 'https://github.com/heyq02', weeks: [] }
    )

    expect(data).toEqual({
      projects: [
        {
          name: 'demo',
          href: 'https://github.com/heyq02/demo',
          summary: 'hi',
          language: 'TypeScript',
          stars: 1,
          forks: 0
        }
      ],
      contributions: { total: 3, href: 'https://github.com/heyq02', weeks: [] }
    })
    expect(renderProfileDataJson(data)).toBe(`${JSON.stringify(data, null, 2)}\n`)
  })
})
