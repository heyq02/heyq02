import { graphql } from '@octokit/graphql'

import { GITHUB_TIMEOUT_MS, profileStubEnabled, requireGithubToken } from './github-client.ts'
import type { GraphqlClient } from './github-client.ts'

export interface PinnedProject {
  name: string
  href: string
  summary: string
  language: string
  stars: number
  forks: number
}

/** GitHub GraphQL repository node used by pinned-items mapping. */
export interface GraphQlRepository {
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

/** Offline fixture when `HEYQ02_PROFILE_STUB=1`. */
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
  login: string,
  options: {
    token?: string
    graphql?: GraphqlClient
  } = {}
): Promise<PinnedProject[]> {
  if (profileStubEnabled()) {
    return STUB_PINNED_PROJECTS
  }

  const token = options.token ?? requireGithubToken('pinned GitHub projects')
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
        signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS)
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
