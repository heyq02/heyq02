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
  tags: string[]
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
    writing: string
  }
  places: Place[]
  experiences: Experience[]
  skills: Skill[]
}
