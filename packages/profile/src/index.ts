/** Shared intro SSOT from `static/data/intro.json` for site, cli, and readme. */

import raw from '../../../static/data/intro.json' with { type: 'json' }
import type { Intro, Place, Skill } from './types.ts'

export type { Contact, Experience, Intro, Place, Project, Skill } from './types.ts'

export const intro = raw as Intro

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

export const {
  name,
  names,
  degree,
  city,
  bio,
  kaomoji,
  avatar,
  site,
  kicker,
  title,
  description,
  contact,
  sections,
  experiences,
  projects
} = intro

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

export function fullName(role = ''): string {
  return `${intro.name}${role}`
}

/** Terminal-oriented view of the same intro. */
export const profile = {
  name: intro.name,
  givenNames: intro.names as unknown as readonly [string, ...string[]],
  role: '',
  bio: `${intro.bio} ${intro.kaomoji}`,
  phone: intro.contact.phone,
  email: intro.contact.email,
  site: intro.site,
  places,
  experiences: intro.experiences,
  skills,
  projects: intro.projects.map(({ languageColor: _languageColor, ...project }) => project)
}
