import { expect, it } from 'vite-plus/test'

import {
  fetchPinnedProjects,
  githubLogin,
  githubToken,
  mapPinnedRepository
} from '../src/github-pinned.ts'

const pinnedResponse = Response.json({
  data: {
    user: {
      pinnedItems: {
        nodes: [
          {
            name: 'simpleicons.dev',
            nameWithOwner: 'heyq02/simpleicons.dev',
            url: 'https://github.com/heyq02/simpleicons.dev',
            description: 'Showcase skills',
            stargazerCount: 172,
            forkCount: 0,
            primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
            owner: { login: 'heyq02' }
          }
        ]
      }
    }
  }
})

function fetchMock() {
  return Promise.resolve(pinnedResponse)
}

it('reads the GitHub login from intro places', () => {
  expect(githubLogin()).toBe('heyq02')
})

it('prefers GITHUB_TOKEN then GH_TOKEN', () => {
  expect(githubToken({ GITHUB_TOKEN: 'a', GH_TOKEN: 'b' })).toBe('a')
  expect(githubToken({ GH_TOKEN: 'b' })).toBe('b')
  expect(githubToken({})).toBeUndefined()
})

it('uses the short name for own repos and nameWithOwner otherwise', () => {
  expect(
    mapPinnedRepository(
      {
        name: 'simpleicons.dev',
        nameWithOwner: 'heyq02/simpleicons.dev',
        url: 'https://github.com/heyq02/simpleicons.dev',
        description: 'Showcase skills',
        stargazerCount: 172,
        forkCount: 0,
        primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
        owner: { login: 'heyq02' }
      },
      'heyq02'
    )
  ).toMatchObject({
    name: 'simpleicons.dev',
    language: 'TypeScript',
    stars: 172,
    forks: 0
  })

  expect(
    mapPinnedRepository(
      {
        name: 'taro-ui',
        nameWithOwner: 'jd-opensource/taro-ui',
        url: 'https://github.com/jd-opensource/taro-ui',
        description: null,
        stargazerCount: 4730,
        forkCount: 743,
        primaryLanguage: null,
        owner: { login: 'jd-opensource' }
      },
      'heyq02'
    )
  ).toMatchObject({
    name: 'jd-opensource/taro-ui',
    summary: '',
    language: 'Unknown'
  })
})

it('loads pinned repositories from GitHub GraphQL', async () => {
  await expect(
    fetchPinnedProjects('heyq02', { token: 'test-token', fetch: fetchMock })
  ).resolves.toEqual([
    {
      name: 'simpleicons.dev',
      href: 'https://github.com/heyq02/simpleicons.dev',
      summary: 'Showcase skills',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 172,
      forks: 0
    }
  ])
})

it('fails when no token is available', async () => {
  await expect(
    fetchPinnedProjects('heyq02', {
      token: '',
      fetch: () => Promise.resolve(new Response())
    })
  ).rejects.toThrow(/GITHUB_TOKEN/)
})
