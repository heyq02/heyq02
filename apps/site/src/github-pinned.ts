import { intro } from '@heyq02/profile'

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

interface GraphQlResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: (GraphQlRepository | null)[]
      }
    }
  }
  errors?: { message: string }[]
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

export function githubLogin(places = intro.places): string {
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
  login = githubLogin(),
  options: {
    token?: string
    fetch?: typeof globalThis.fetch
  } = {}
): Promise<PinnedProject[]> {
  const token = options.token ?? githubToken()
  if (!token) {
    throw new Error('Set GITHUB_TOKEN or GH_TOKEN to load pinned GitHub projects')
  }

  const fetchImpl = options.fetch ?? globalThis.fetch
  const response = await fetchImpl('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'heyq02-site'
    },
    body: JSON.stringify({
      query: pinnedQuery,
      variables: { login }
    })
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed with ${response.status}`)
  }

  const payload = (await response.json()) as GraphQlResponse
  if (payload.errors?.length) {
    throw new Error(payload.errors.map(error => error.message).join('; '))
  }

  const nodes = payload.data?.user?.pinnedItems?.nodes ?? []
  return nodes
    .filter((node): node is GraphQlRepository => node !== null && Boolean(node.url))
    .map(node => mapPinnedRepository(node, login))
}
