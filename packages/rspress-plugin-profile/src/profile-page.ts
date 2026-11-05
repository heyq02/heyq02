import type { ContributionCalendar, GithubProfileData } from '@heyq02/rspress-site-content'

import type { PinnedProject } from './github-pinned.ts'

/** Assemble the committed JSON snapshot (repo descriptions as returned by GitHub). */
export function profileData(
  projects: PinnedProject[] = [],
  contributions: ContributionCalendar = { total: 0, href: '', weeks: [] }
): GithubProfileData {
  return {
    projects: projects.map(project => ({
      name: project.name,
      href: project.href,
      summary: project.summary,
      language: project.language,
      stars: project.stars,
      forks: project.forks
    })),
    contributions
  }
}

export function renderProfileDataJson(data: GithubProfileData): string {
  return `${JSON.stringify(data, null, 2)}\n`
}
