import type { Intro, Place } from '@heyq02/rspress-site-content'
import { graphql } from '@octokit/graphql'

export interface PinnedProject {
  name: string
  href: string
  summary: string
  language: string
  stars: number
  forks: number
}

interface GraphQlRepository {
  name: string
  nameWithOwner: string
  url: string
  description: string | null
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string } | null
  owner: { login: string }
}

interface PinnedQueryResult {
  user: {
    pinnedItems: {
      nodes: (GraphQlRepository | null)[]
    }
  } | null
}

export const PINNED_TIMEOUT_MS = 10_000

const pinnedQuery = `query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          nameWithOwner
          url
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          owner {
            login
          }
        }
      }
    }
  }
}`

export type GraphqlClient = typeof graphql

export function githubLogin(places: Place[]): string {
  const place = places.find(item => item.label === 'GitHub')
  if (!place) {
    throw new Error('intro.places has no GitHub entry')
  }
  if (place.detail) {
    return place.detail
  }
  return new URL(place.href).pathname.replaceAll(/^\/+|\/+$/g, '')
}

export function githubToken(env: NodeJS.ProcessEnv = process.env): string | undefined {
  return env.GITHUB_TOKEN ?? env.GH_TOKEN
}

/** Offline / CI fixture when `HEYQ02_PROFILE_STUB=1`. */
export const STUB_PINNED_PROJECTS: PinnedProject[] = [
  {
    name: 'simpleicons.dev',
    href: 'https://github.com/heyq02/simpleicons.dev',
    summary: 'Showcase your skills on your GitHub readme or resumé with ease.',
    language: 'TypeScript',
    stars: 171,
    forks: 0
  },
  {
    name: 'keyboard-source-locker',
    href: 'https://github.com/heyq02/keyboard-source-locker',
    summary: 'macOS menu-bar utility that locks the active keyboard input source to your choice',
    language: 'Swift',
    stars: 19,
    forks: 0
  }
]

export function profileStubEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.HEYQ02_PROFILE_STUB === '1'
}

export function mapPinnedRepository(repo: GraphQlRepository, login: string): PinnedProject {
  return {
    name: repo.owner.login === login ? repo.name : repo.nameWithOwner,
    href: repo.url,
    summary: repo.description ?? '',
    language: repo.primaryLanguage?.name ?? 'Unknown',
    stars: repo.stargazerCount,
    forks: repo.forkCount
  }
}

/** Load profile pinned repositories via the GitHub GraphQL API. */
export async function fetchPinnedProjects(
  intro: Intro,
  options: {
    token?: string
    graphql?: GraphqlClient
  } = {}
): Promise<PinnedProject[]> {
  if (profileStubEnabled()) {
    return STUB_PINNED_PROJECTS
  }

  const login = githubLogin(intro.places)
  const token = options.token ?? githubToken()
  if (!token) {
    throw new Error(
      'Set GITHUB_TOKEN or GH_TOKEN to load pinned GitHub projects (or HEYQ02_PROFILE_STUB=1 for offline CI)'
    )
  }

  const client = options.graphql ?? graphql
  let payload: PinnedQueryResult
  try {
    payload = await client<PinnedQueryResult>(pinnedQuery, {
      login,
      headers: {
        authorization: `Bearer ${token}`,
        'user-agent': 'heyq02-site'
      },
      request: {
        signal: AbortSignal.timeout(PINNED_TIMEOUT_MS)
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`GitHub GraphQL request failed: ${message}`, { cause: error })
  }

  const nodes = payload.user?.pinnedItems.nodes ?? []
  return nodes
    .filter((node): node is GraphQlRepository => node !== null && Boolean(node.url))
    .map(node => mapPinnedRepository(node, login))
}
