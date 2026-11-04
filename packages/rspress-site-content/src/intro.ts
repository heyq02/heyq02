/** Profile intro SSOT shape (matches `content/data/intro.json`). */

export interface Place {
  label: string
  href: string
  detail: string
}

export interface Skill {
  name: string
  /** Simple-icons slug used by the shared skills picture. */
  icon: string
  href: string
  summary: string
}

export interface Contact {
  phone: string
  email: string
}

export interface HomePlace {
  /** Display label, e.g. 通州区. */
  label: string
  latitude: number
  longitude: number
}

export interface Intro {
  name: string
  /** Homepage hero greeting (may differ from `name` / site title). */
  headline: string
  /** Short badge next to the kaomoji, e.g. `02`. */
  badge: string
  zodiac: string
  /** Hometown / live-weather anchor for the hero strip. */
  home: HomePlace
  tags: string[]
  bio: string
  /** Optional longer about paragraph shown under the hero. */
  about: string
  kaomoji: string
  /** Click-to-cycle faces on the homepage hero; first entry should match `kaomoji`. */
  moods: string[]
  avatar: string
  site: string
  title: string
  description: string
  contact: Contact
  sections: {
    about: string
    blog: string
    contributions: string
    likes: string
    skills: string
    openSource: string
  }
  places: Place[]
  skills: Skill[]
  /** Chinese blurbs keyed by pinned repo name; overrides the GitHub description. */
  projectSummaries: Record<string, string>
}

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
