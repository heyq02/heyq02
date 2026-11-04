/** Profile intro SSOT shape (matches `content/data/intro.json`). */

export interface Place {
  label: string
  href: string
  detail: string
}

export interface Experience {
  company: string
  href: string
  start: string
  end: string
  points: string[]
}

export interface Education {
  school: string
  /** English school name shown beside `school`. */
  schoolEn: string
  major: string
  /** English major shown beside `major`. */
  majorEn: string
  degree: string
  /** English degree shown beside `degree`. */
  degreeEn: string
  start: string
  end: string
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
  kaomoji: string
  /** Click-to-cycle faces on the homepage hero; first entry should match `kaomoji`. */
  moods: string[]
  avatar: string
  site: string
  title: string
  description: string
  contact: Contact
  sections: {
    education: string
    experience: string
    skills: string
    openSource: string
  }
  places: Place[]
  education: Education[]
  experiences: Experience[]
  skills: Skill[]
}

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
