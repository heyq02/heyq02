export interface Project {
  name: string
  href: string
  summary: string
  language: string
  languageColor: string
  stars: number
  forks: number
}

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

export interface Skill {
  name: string
  href: string
  summary: string
}

export interface Contact {
  phone: string
  email: string
}

export interface Intro {
  name: string
  names: string[]
  degree: string
  city: string
  bio: string
  kaomoji: string
  avatar: string
  site: string
  kicker: string
  title: string
  description: string
  contact: Contact
  sections: {
    experience: string
    skills: string
    openSource: string
  }
  places: Place[]
  experiences: Experience[]
  skills: Skill[]
  projects: Project[]
}
