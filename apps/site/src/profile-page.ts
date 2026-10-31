import { skillIconsPicture } from '@heyq02/brands'
import { formatCount, intro } from '@heyq02/profile'
import type { Intro } from '@heyq02/profile'

export interface ProfilePage {
  name: string
  degree: string
  city: string
  bio: string
  kaomoji: string
  avatar: string
  sections: Intro['sections']
  experiences: Intro['experiences']
  skills: { alt: string; src: string }
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
    experiences: intro.experiences,
    skills: skillIconsPicture(intro.skills.map(skill => skill.name)),
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
