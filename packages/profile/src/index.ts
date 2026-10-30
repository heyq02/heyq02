/** Shared intro SSOT from `static/data/intro.json` for site, cli, and readme. */

import raw from '../../../static/data/intro.json' with { type: 'json' }
import chineseRaw from '../../../static/data/intro.zh.json' with { type: 'json' }
import type { ChineseOverlay, Intro, Place, Skill } from './types.ts'

export type { ChineseOverlay, Contact, Experience, Intro, Place, Project, Skill } from './types.ts'

export const intro = raw satisfies Intro
export const chinese = chineseRaw satisfies ChineseOverlay

function zip<T, U>(
  label: string,
  base: readonly T[],
  overlay: readonly U[],
  merge: (item: T, extra: U) => T
): T[] {
  if (base.length !== overlay.length) {
    throw new Error(`Chinese ${label} (${overlay.length}) must match English (${base.length})`)
  }
  return base.map((item, index) => merge(item, overlay[index] as U))
}

/** Chinese copy over the English intro. Links, start dates, counts, and skill names stay English. */
export function mergeIntro(english: Intro, overlay: ChineseOverlay): Intro {
  return {
    ...english,
    names: overlay.names,
    degree: overlay.degree,
    city: overlay.city,
    bio: overlay.bio,
    kicker: overlay.kicker,
    title: overlay.title,
    description: overlay.description,
    sections: overlay.sections,
    places: zip('places', english.places, overlay.places, (place, extra) => ({
      ...place,
      detail: extra.detail
    })),
    experiences: zip('experiences', english.experiences, overlay.experiences, (job, extra) => ({
      ...job,
      company: extra.company,
      end: extra.end,
      points: extra.points
    })),
    skills: zip('skills', english.skills, overlay.skills, (skill, extra) => ({
      ...skill,
      summary: extra.summary
    })),
    projects: zip('projects', english.projects, overlay.projects, (project, extra) => ({
      ...project,
      summary: extra.summary
    }))
  }
}

export const introZh = mergeIntro(intro, chinese)

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
