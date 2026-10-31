/** Shared intro SSOT from `static/data/intro.json`. Site runtime imports this package; readme and rspress config may read the JSON file directly. The CLI does not. */

import raw from '../../../static/data/intro.json' with { type: 'json' }
import type { Intro, Place, Skill } from './types.ts'

export type { Contact, Education, Experience, Intro, Place, Skill } from './types.ts'

export const intro = raw satisfies Intro

export function absoluteHref(href: string, site = intro.site): string {
  if (href.startsWith('/')) {
    return `${site}${href}`
  }
  return href
}

export const places: Place[] = intro.places.map(place => ({
  ...place,
  href: absoluteHref(place.href)
}))

export const skills: Skill[] = intro.skills.map(skill => ({
  ...skill,
  href: absoluteHref(skill.href)
}))

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

export function fullName(role = ''): string {
  return `${intro.name}${role}`
}

/** Convenience view of the same intro for tests and local inspection. */
export const profile = {
  name: intro.name,
  bio: `${intro.tags.join(' · ')}. ${intro.bio} ${intro.kaomoji}`,
  phone: intro.contact.phone,
  email: intro.contact.email,
  site: intro.site,
  places,
  education: intro.education,
  experiences: intro.experiences,
  skills
}
