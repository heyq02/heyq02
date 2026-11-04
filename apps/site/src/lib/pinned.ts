/** Build-time pinned projects from `static/data/pinned.json`. */
import raw from '../../../../static/data/pinned.json' with { type: 'json' }

export interface PinnedProject {
  name: string
  href: string
  summary: string
  language: string
  stars: number
  forks: number
}

export const pinnedProjects: PinnedProject[] = raw
