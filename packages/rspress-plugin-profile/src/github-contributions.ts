import type { Intro } from '@heyq02/rspress-site-content'
import { graphql } from '@octokit/graphql'

import { githubLogin, githubToken, PINNED_TIMEOUT_MS, profileStubEnabled } from './github-pinned.ts'
import type { GraphqlClient } from './github-pinned.ts'

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionCalendar {
  total: number
  href: string
  weeks: ContributionDay[][]
}

type GithubContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE'

interface ContributionQueryResult {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number
        weeks: {
          contributionDays: {
            date: string
            contributionCount: number
            contributionLevel: GithubContributionLevel
          }[]
        }[]
      }
    }
  } | null
}

const contributionQuery = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`

const LEVEL_MAP: Record<GithubContributionLevel, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
}

/** Deterministic offline calendar for `HEYQ02_PROFILE_STUB=1`. */
export function stubContributionCalendar(login = 'heyq02'): ContributionCalendar {
  const weeks: ContributionDay[][] = []
  const start = new Date('2025-01-05T00:00:00Z')
  for (let week = 0; week < 52; week += 1) {
    const days: ContributionDay[] = []
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + week * 7 + weekday)
      const count = (week * 7 + weekday) % 5 === 0 ? ((week + weekday) % 4) + 1 : 0
      days.push({
        date: date.toISOString().slice(0, 10),
        count,
        level: count as ContributionLevel
      })
    }
    weeks.push(days)
  }

  return {
    total: weeks.flat().reduce((sum, day) => sum + day.count, 0),
    href: `https://github.com/${login}`,
    weeks
  }
}

export function mapContributionCalendar(
  payload: ContributionQueryResult,
  login: string
): ContributionCalendar {
  const calendar = payload.user?.contributionsCollection.contributionCalendar
  if (!calendar) {
    throw new Error(`GitHub user "${login}" not found for contribution calendar`)
  }

  return {
    total: calendar.totalContributions,
    href: `https://github.com/${login}`,
    weeks: calendar.weeks.map(week =>
      week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel]
      }))
    )
  }
}

/** Load the last-year GitHub contribution calendar via GraphQL. */
export async function fetchContributionCalendar(
  intro: Intro,
  options: {
    token?: string
    graphql?: GraphqlClient
  } = {}
): Promise<ContributionCalendar> {
  if (profileStubEnabled()) {
    return stubContributionCalendar(githubLogin(intro.places))
  }

  const login = githubLogin(intro.places)
  const token = options.token ?? githubToken()
  if (!token) {
    throw new Error(
      'Set GITHUB_TOKEN or GH_TOKEN to load GitHub contributions (or HEYQ02_PROFILE_STUB=1 for offline CI)'
    )
  }

  const client = options.graphql ?? graphql
  let payload: ContributionQueryResult
  try {
    payload = await client<ContributionQueryResult>(contributionQuery, {
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

  return mapContributionCalendar(payload, login)
}
