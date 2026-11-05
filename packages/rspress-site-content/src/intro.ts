/** Profile intro SSOT shape (matches `content/data/intro.json`). */

export interface Place {
  label: string
  href: string
  detail: string
}

export interface Contact {
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
  /** Longer about under the hero — should not restate `tags` or `bio`. */
  about: string
  kaomoji: string
  /** Click-to-cycle faces on the homepage hero; first entry should match `kaomoji`. */
  moods: string[]
  avatar: string
  site: string
  title: string
  contact: Contact
  sections: {
    blog: string
    openSource: string
  }
  places: Place[]
  /** Chinese blurbs keyed by pinned repo name; overrides the GitHub description. */
  projectSummaries: Record<string, string>
}

/** SEO / RSS / llms meta line — composed from name, tags, and bio. */
export function siteDescription(intro: Pick<Intro, 'name' | 'tags' | 'bio'>): string {
  return `${intro.name}。${intro.tags.join('、')}。${intro.bio}。`
}

/** Browser tab suffix after the name (`贺同学 - …`). */
export function documentTitleSuffix(intro: Pick<Intro, 'tags' | 'bio'>): string {
  return `${[...intro.tags, intro.bio].join('，')}。`
}

/** `2026-06-22` → `2026年6月22日`. */
export function formatZhDate(iso: string): string {
  const match = /^(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})$/.exec(iso)
  if (!match?.groups) {
    return iso
  }
  return `${match.groups.y}年${Number(match.groups.m)}月${Number(match.groups.d)}日`
}

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
