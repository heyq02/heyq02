import type { graphql } from '@octokit/graphql'

export type GraphqlClient = typeof graphql

export const GITHUB_TIMEOUT_MS = 10_000

export function githubLoginFromPlaces(
  places: { label: string; href: string; detail: string }[]
): string {
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
export function profileStubEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.HEYQ02_PROFILE_STUB === '1'
}

export function requireGithubToken(purpose: string): string {
  const token = githubToken()
  if (!token) {
    throw new Error(
      `Set GITHUB_TOKEN or GH_TOKEN to load ${purpose} (or HEYQ02_PROFILE_STUB=1 for offline CI)`
    )
  }
  return token
}
