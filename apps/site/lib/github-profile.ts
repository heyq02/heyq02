import type { GithubProfileData } from '@heyq02/rspress-site-content'

import data from '../../../content/data/github-profile.json' with { type: 'json' }

export { formatCount } from '@heyq02/rspress-site-content'
export type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
  GithubPinnedProject,
  GithubProfileData
} from '@heyq02/rspress-site-content'

/** Committed GitHub snapshot — refreshed by `crefresh-profile` / Release Site. */
export const githubProfile = data as GithubProfileData

export const pinnedProjects = githubProfile.projects
export const contributionCalendar = githubProfile.contributions
