/**
 * Refresh `static/data/pinned.json` from GitHub GraphQL.
 * Usage: GITHUB_TOKEN=… pnpm --filter @heyq02/site exec node --experimental-strip-types ./scripts/refresh-pinned.ts
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { graphql } from '@octokit/graphql'

import intro from '../../../static/data/intro.json' with { type: 'json' }

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

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
if (!token) {
  throw new Error('Set GITHUB_TOKEN or GH_TOKEN to refresh pinned projects')
}

const place = intro.places.find(item => item.label === 'GitHub')
if (!place) {
  throw new Error('intro.places has no GitHub entry')
}
const login = place.detail || new URL(place.href).pathname.replaceAll(/^\/+|\/+$/g, '')

const payload = await graphql<PinnedQueryResult>(
  `query($login: String!) {
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
            primaryLanguage { name }
            owner { login }
          }
        }
      }
    }
  }`,
  {
    login,
    headers: {
      authorization: `Bearer ${token}`,
      'user-agent': 'heyq02-site'
    },
    request: { signal: AbortSignal.timeout(10_000) }
  }
)

const projects = (payload.user?.pinnedItems.nodes ?? [])
  .filter((node): node is GraphQlRepository => node !== null && Boolean(node.url))
  .map(repo => ({
    name: repo.owner.login === login ? repo.name : repo.nameWithOwner,
    href: repo.url,
    summary: repo.description ?? '',
    language: repo.primaryLanguage?.name ?? 'Unknown',
    stars: repo.stargazerCount,
    forks: repo.forkCount
  }))

const out = resolve(import.meta.dirname, '../../../static/data/pinned.json')
writeFileSync(out, `${JSON.stringify(projects, null, 2)}\n`)
console.log(`wrote ${projects.length} projects → ${out}`)
