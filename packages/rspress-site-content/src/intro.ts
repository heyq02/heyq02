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
}

/** SEO / RSS / llms meta line — composed from name, tags, and bio. */
export function siteDescription(intro: Pick<Intro, 'name' | 'tags' | 'bio'>): string {
  return `${intro.name}。${intro.tags.join('、')}。${intro.bio}。`
}

/** Browser tab suffix after the name (`贺同学 - …`). */
export function documentTitleSuffix(intro: Pick<Intro, 'tags' | 'bio'>): string {
  return `${[...intro.tags, intro.bio].join('，')}。`
}
