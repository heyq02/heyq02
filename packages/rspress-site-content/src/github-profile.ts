/** GitHub homepage snapshot shape (matches `content/data/github-profile.json`). */

export interface GithubPinnedProject {
  name: string
  href: string
  summary: string
  language: string
  stars: number
  forks: number
}

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

export interface GithubProfileData {
  projects: GithubPinnedProject[]
  contributions: ContributionCalendar
}

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
