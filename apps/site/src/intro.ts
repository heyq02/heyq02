/** Typed SSOT over `static/data/intro.json` for site runtime and theme. */
import raw from '../../../static/data/intro.json' with { type: 'json' }

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
  major: string
  degree: string
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

export interface Intro {
  name: string
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
    writing: string
  }
  places: Place[]
  education: Education[]
  experiences: Experience[]
  skills: Skill[]
}

export const intro = raw satisfies Intro

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
