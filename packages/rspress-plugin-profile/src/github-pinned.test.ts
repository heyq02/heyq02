import { describe, expect, it } from 'vitest'

import { mapPinnedRepository } from './github-pinned.ts'
import type { GraphQlRepository } from './github-pinned.ts'

function repo(
  partial: Partial<GraphQlRepository> & Pick<GraphQlRepository, 'name' | 'url'>
): GraphQlRepository {
  return {
    nameWithOwner: `other/${partial.name}`,
    description: null,
    stargazerCount: 0,
    forkCount: 0,
    primaryLanguage: null,
    owner: { login: 'other' },
    ...partial
  }
}

describe('mapPinnedRepository', () => {
  it('uses short name for own repos', () => {
    expect(
      mapPinnedRepository(
        repo({
          name: 'simpleicons.dev',
          nameWithOwner: 'heyq02/simpleicons.dev',
          url: 'https://github.com/heyq02/simpleicons.dev',
          description: 'icons',
          stargazerCount: 171,
          forkCount: 2,
          primaryLanguage: { name: 'TypeScript' },
          owner: { login: 'heyq02' }
        }),
        'heyq02'
      )
    ).toEqual({
      name: 'simpleicons.dev',
      href: 'https://github.com/heyq02/simpleicons.dev',
      summary: 'icons',
      language: 'TypeScript',
      stars: 171,
      forks: 2
    })
  })

  it('keeps nameWithOwner for foreign repos and defaults language', () => {
    expect(
      mapPinnedRepository(
        repo({
          name: 'vite',
          nameWithOwner: 'vitejs/vite',
          url: 'https://github.com/vitejs/vite',
          owner: { login: 'vitejs' }
        }),
        'heyq02'
      )
    ).toEqual({
      name: 'vitejs/vite',
      href: 'https://github.com/vitejs/vite',
      summary: '',
      language: 'Unknown',
      stars: 0,
      forks: 0
    })
  })
})
