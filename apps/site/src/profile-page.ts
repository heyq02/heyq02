import { absoluteHref, formatCount, intro, introZh } from '@heyq02/profile'
import type { Intro } from '@heyq02/profile'

export type SiteLocale = 'zh' | 'en'

export interface ProfilePage {
  name: string
  degree: string
  city: string
  bio: string
  kaomoji: string
  avatar: string
  sections: Intro['sections']
  places: { label: string; href: string; detail: string }[]
  experiences: Intro['experiences']
  skills: { name: string; href: string; summary: string }[]
  projects: {
    name: string
    href: string
    summary: string
    language: string
    stars: string
    forks: string
  }[]
  emptyBlog: string
}

const emptyBlog: Record<SiteLocale, string> = {
  zh: '还没有文章。',
  en: 'No posts yet.'
}

export function profilePage(locale: SiteLocale): ProfilePage {
  const source = locale === 'zh' ? introZh : intro
  return {
    name: source.name,
    degree: source.degree,
    city: source.city,
    bio: source.bio,
    kaomoji: source.kaomoji,
    avatar: source.avatar,
    sections: source.sections,
    places: source.places.map(place => ({
      label: place.label,
      detail: place.detail,
      href: absoluteHref(place.href)
    })),
    experiences: source.experiences,
    skills: source.skills.map(skill => ({
      name: skill.name,
      href: absoluteHref(skill.href),
      summary: skill.summary
    })),
    projects: source.projects.map(project => ({
      name: project.name,
      href: project.href,
      summary: project.summary,
      language: project.language,
      stars: formatCount(project.stars),
      forks: formatCount(project.forks)
    })),
    emptyBlog: emptyBlog[locale]
  }
}
