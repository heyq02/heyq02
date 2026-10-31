import { absoluteHref, formatCount, intro } from '@heyq02/profile'
import type { Intro } from '@heyq02/profile'

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

export function profilePage(): ProfilePage {
  return {
    name: intro.name,
    degree: intro.degree,
    city: intro.city,
    bio: intro.bio,
    kaomoji: intro.kaomoji,
    avatar: intro.avatar,
    sections: intro.sections,
    places: intro.places.map(place => ({
      label: place.label,
      detail: place.detail,
      href: absoluteHref(place.href)
    })),
    experiences: intro.experiences,
    skills: intro.skills.map(skill => ({
      name: skill.name,
      href: absoluteHref(skill.href),
      summary: skill.summary
    })),
    projects: intro.projects.map(project => ({
      name: project.name,
      href: project.href,
      summary: project.summary,
      language: project.language,
      stars: formatCount(project.stars),
      forks: formatCount(project.forks)
    })),
    emptyBlog: 'No posts yet.'
  }
}
