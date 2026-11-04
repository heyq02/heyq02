import { describe, expect, it } from 'vitest'

import { githubLogin, mapPinnedRepository } from './github-pinned.ts'

describe('github-pinned', () => {
  it('reads login from intro places', () => {
    expect(githubLogin()).toBe('heyq02')
  })

  it('maps owned repos to short names', () => {
    expect(
      mapPinnedRepository(
        {
          name: 'heyq02',
          nameWithOwner: 'heyq02/heyq02',
          url: 'https://github.com/heyq02/heyq02',
          description: 'site',
          stargazerCount: 3,
          forkCount: 1,
          primaryLanguage: { name: 'TypeScript' },
          owner: { login: 'heyq02' }
        },
        'heyq02'
      )
    ).toEqual({
      name: 'heyq02',
      href: 'https://github.com/heyq02/heyq02',
      summary: 'site',
      language: 'TypeScript',
      stars: 3,
      forks: 1
    })
  })
})
